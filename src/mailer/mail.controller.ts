import { Body, Controller, Get, Post } from '@nestjs/common';
import { VerifyMailRequest } from './dto/verifyMailRequest.dto';
import { MailService } from './mail.service';
import { validateEmailAddress } from '../util/util';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/verify/send')
  async sendVerifyMail(@Body() verifyMailDto: VerifyMailRequest) {
    validateEmailAddress(verifyMailDto.email); // todo validator 작업하기
    return this.mailService.insertVerifyCode(verifyMailDto);
  }

  @Get('/verify/check')
  async checkVerifyCode(@Body() verifyMailDto: VerifyMailRequest) {
    validateEmailAddress(verifyMailDto.email);
    return this.mailService.checkVerifyCode(verifyMailDto);
  }
}
