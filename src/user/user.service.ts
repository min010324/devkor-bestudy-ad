import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../model/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(email: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email: email },
    });
    return user;
  }

  async getUserByNickName(nickname: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { nickname: nickname },
    });
    return user;
  }

  async updateUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
