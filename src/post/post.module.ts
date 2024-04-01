import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../model/entities/post.entity';
import { Reply } from '../model/entities/reply.entity';
import { ReplyRepository } from './reply.repository';
import { LikePost } from '../model/entities/likePost.entity';
import { LikePostRepository } from './likePost.repository';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, ReplyRepository, LikePostRepository],
  imports: [UserModule, TypeOrmModule.forFeature([Post, Reply, LikePost])],
})
export class PostModule {}
