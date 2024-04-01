import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuthCode } from '../model/entities/authCode.entity';

@Injectable()
export class AuthRepository extends Repository<AuthCode> {
  private authRepository: Repository<AuthCode>;

  constructor(private readonly dataSource: DataSource) {
    super(AuthCode, dataSource.createEntityManager());
  }
}
