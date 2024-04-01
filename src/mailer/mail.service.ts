import { Injectable } from '@nestjs/common';
import { VerifyMailRequest } from './dto/verifyMailRequest.dto';
import { AuthService } from '../auth/auth.service';
import { AuthCode } from '../model/entities/authCode.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as process from 'process';

@Injectable()
export class MailService {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(code: string, to: string) {
    await this.mailerService.sendMail({
      to: to,
      from: process.env.MAIL_USER,
      subject: '이메일 인증코드입니다.',
      html: `인증 번호 [${code}]를 입력해주세요.`,
    });
  }

  async insertVerifyCode(verifyCodeDto: VerifyMailRequest) {
    const authCode: AuthCode =
      await this.authService.insertVerifyCode(verifyCodeDto);
    await this.sendMail(authCode.authCode, authCode.email);
  }

  async checkVerifyCode(verifyCodeDto: VerifyMailRequest) {
    await this.authService.checkVerifyCode(verifyCodeDto);
  }
}
