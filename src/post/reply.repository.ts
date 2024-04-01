import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Reply } from '../model/entities/reply.entity';

@Injectable()
export class ReplyRepository extends Repository<Reply> {
  private replyRepository: Repository<Reply>;

  constructor(private readonly dataSource: DataSource) {
    super(Reply, dataSource.createEntityManager());
  }
}
