import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [AuthModule],
})
// mailer 에러 관련 참고 https://github.com/nest-modules/mailer/issues/1131
export class MailModule {}
