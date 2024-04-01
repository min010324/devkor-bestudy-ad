import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthCode } from '../model/entities/authCode.entity';
import { AuthRepository } from './auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './passport/local.strategy';
import { AccessTokenStrategy } from './passport/accesstoken.strategy';
import { RefreshTokenStrategy } from './passport/refreshtoken.straregy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([AuthCode]),
    PassportModule,
    JwtModule.register({}),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   global: true,
    //   useFactory: (config: ConfigService) => ({
    //     secret: config.get<string>('ACCESS_TOKEN_SECRET_KEY'),
    //     signOptions: {
    //       expiresIn: config.get<string>('ACCESS_TOKEN_EXPIRE_TIME'),
    //     },
    //   }),
    // }),
    UserModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
