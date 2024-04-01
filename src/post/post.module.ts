import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../model/entities/post.entity';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
  imports: [UserModule, TypeOrmModule.forFeature([Post])],
})
export class PostModule {}
