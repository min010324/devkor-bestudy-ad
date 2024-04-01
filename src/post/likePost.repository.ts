import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { LikePost } from '../model/entities/likePost.entity';

@Injectable()
export class LikePostRepository extends Repository<LikePost> {
  private likePostRepository: Repository<LikePost>;

  constructor(private readonly dataSource: DataSource) {
    super(LikePost, dataSource.createEntityManager());
  }
}
