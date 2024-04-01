import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Post } from '../model/entities/post.entity';

@Injectable()
export class PostRepository extends Repository<Post> {
  private postRepository: Repository<Post>;

  constructor(private readonly dataSource: DataSource) {
    super(Post, dataSource.createEntityManager());
  }
}
