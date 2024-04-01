import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // https://stackoverflow.com/questions/74017615/nestjs-returns-401-unauthorized-even-with-valid-user-ft-passport-local
  }

  async validate(email: string, password: string) {
    return await this.authService.validateUser(email, password);
  }
}
