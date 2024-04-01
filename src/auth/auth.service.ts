import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyMailRequest } from '../mailer/dto/verifyMailRequest.dto';
import { AuthRepository } from './auth.repository';
import { AuthCode } from '../model/entities/authCode.entity';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { validateEmailAddress, validatePassword } from '../util/util';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../model/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { TokenType } from '../type/auth.type';
import { ApiResponseDto } from '../util/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly salt = parseInt(process.env.HASH_SALT);

  async signup(loginRequestDto: LoginRequestDto): Promise<ApiResponseDto> {
    validateEmailAddress(loginRequestDto.email);
    validatePassword(loginRequestDto.password);

    const userByEmail: User = await this.userService.getUser(
      loginRequestDto.email,
    );
    if (userByEmail) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const userByNickname: User = await this.userService.getUserByNickName(
      loginRequestDto.nickname,
    );

    if (userByNickname) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    // 이메일 인증 여부 확인
    const authCode = await this.authRepository.findOne({
      where: { email: loginRequestDto.email },
      order: { regDate: 'DESC' },
    });
    if (!authCode.status) {
      throw new UnauthorizedException('인증되지 않은 이메일입니다.');
    }

    // 비밀번호 암호화
    const passwordEnc = await hash(loginRequestDto.password, this.salt);

    // token 생성
    const token: TokenType = await this.generateToken(
      loginRequestDto.email,
      loginRequestDto.nickname,
    );
    // 유저 생성
    const newUser: User = User.newEntity(
      loginRequestDto.nickname,
      loginRequestDto.email,
      passwordEnc,
      token.refreshToken,
    );

    // 유저 저장
    await this.userService.updateUser(newUser);

    return new ApiResponseDto({ user: { ...newUser }, token }, HttpStatus.OK);
  }

  async login(loginUser: User): Promise<ApiResponseDto> {
    // 유효성 검증
    const token = await this.generateToken(loginUser.email, loginUser.nickname);
    loginUser.refreshToken = token.refreshToken;
    const savedUser = await this.userService.updateUser(loginUser);
    return new ApiResponseDto({ user: { ...savedUser }, token }, HttpStatus.OK);
  }

  async validateUser(email: string, password: string) {
    validateEmailAddress(email); // email 유효성

    const user: User = await this.userService.getUser(email);

    // password 유효성
    const isMatch = await compare(password, user.passwordEnc);
    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return user;
  }

  async generateToken(email: string, nickname: string): Promise<TokenType> {
    const accessToken = await this.generateAccessToken(email, nickname);
    const refreshToken = await this.generateRefreshToken(email, nickname);
    return { accessToken, refreshToken };
  }

  protected async generateAccessToken(
    email: string,
    nickname: string,
  ): Promise<string> {
    const payload = {
      email: email,
      nickname: nickname,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      subject: 'ACCESS',
    });
  }

  protected async generateRefreshToken(
    email: string,
    nickname: string,
  ): Promise<string> {
    const payload = {
      email: email,
      nickname: nickname,
    };
    return this.jwtService.signAsync(payload, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      subject: 'REFRESH',
    });
  }

  async refreshAccessToken(email: string, refreshToken: string) {
    const user: User = await this.userService.getUser(email);
    if (user?.refreshToken !== refreshToken) {
      throw new UnauthorizedException('유효하지 않은 refresh token 입니다.');
    }

    const accessToken = await this.generateAccessToken(
      user.email,
      user.nickname,
    );

    return accessToken;
  }

  async signout(email: string) {
    const user: User = await this.userService.getUser(email);
    user.status = false;
    user.refreshToken = '';
    await this.userService.updateUser(user);
  }

  async changePassword(email: string, password: string) {
    const user: User = await this.userService.getUser(email);
    const passwordEnc = await hash(password, this.salt);
    user.passwordEnc = passwordEnc;
    await this.userService.updateUser(user);
  }

  async insertVerifyCode(verifyCodeDto: VerifyMailRequest) {
    const code: string = this.generateVerifyCode();
    const authCode: AuthCode = AuthCode.newEntity(verifyCodeDto.email, code);
    return await this.authRepository.save(authCode);
  }

  generateVerifyCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString(); // 문자열로 반환
  }

  async checkVerifyCode(verifyCodeDto: VerifyMailRequest) {
    const authCode = await this.authRepository.findOne({
      where: { email: verifyCodeDto.email },
      order: { regDate: 'DESC' },
    });

    if (!authCode) {
      throw new NotFoundException(
        '요청 이메일로 인증번호가 발급된 내역이 없습니다.',
      );
    }
    const currentTime: Date = new Date();
    const diffTime: number =
      (currentTime.getTime() - authCode.regDate.getTime()) / (1000 * 60);
    if (diffTime > 3) {
      throw new UnauthorizedException('인증번호의 유효시간이 초과되었습니다.');
    }
    if (authCode.authCode !== verifyCodeDto.code) {
      throw new UnauthorizedException('인증번호가 일치하지 않습니다.');
    }
    authCode.status = true;
    await this.authRepository.save(authCode);
  }
}
