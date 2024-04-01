import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from '../model/entities/authCode.entity';
import { AuthRepository } from './auth.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  imports: [TypeOrmModule.forFeature([AuthCode])],
  exports: [AuthService],
})
export class AuthModule {}
