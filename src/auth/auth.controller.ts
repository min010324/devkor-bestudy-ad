import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/loginRequest.dto';
import { ApiResponseDto } from '../util/response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<ApiResponseDto> {
    return await this.authService.signup(loginRequestDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Req() req: any): Promise<ApiResponseDto> {
    return await this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('access'))
  @Post('/test')
  async test(@Req() req: any): Promise<ApiResponseDto> {
    return req.user;
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req: any): Promise<ApiResponseDto> {
    const accessToken = await this.authService.refreshAccessToken(
      req.user.email,
      req.user.refreshToken,
    );
    return new ApiResponseDto({ accessToken }, HttpStatus.OK);
  }

  @Post('/signout')
  @UseGuards(AuthGuard('access'))
  async signout(@Req() req: any): Promise<ApiResponseDto> {
    await this.authService.signout(req.user.email);
    return new ApiResponseDto({}, HttpStatus.OK);
  }

  @Post('/password')
  @UseGuards(AuthGuard('access'))
  async changePassword(
    @Req() req: any,
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<ApiResponseDto> {
    await this.authService.changePassword(
      req.user.email,
      loginRequestDto.password,
    );
    return new ApiResponseDto({}, HttpStatus.OK);
  }
}
