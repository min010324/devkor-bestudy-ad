import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { VerifyMailRequest } from '../mailer/dto/verifyMailRequest.dto';
import { AuthRepository } from './auth.repository';
import { AuthCode } from '../model/entities/authCode.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async insertVerifyCode(verifyCodeDto: VerifyMailRequest) {
    const code = this.generateVerifyCode();
    const authCode = AuthCode.newEntity(verifyCodeDto.email, code);
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
  }
}
