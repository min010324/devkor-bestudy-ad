import { DataSource, Repository } from 'typeorm';
import { User } from '../model/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  private userRepository: Repository<User>;
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
