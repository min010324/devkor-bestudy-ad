import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'process';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET_KEY,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const refreshToken = req.get('authorization').split('Bearer ')[1];
    return {
      ...payload,
      refreshToken,
    };
  }
}
