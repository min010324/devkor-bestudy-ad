import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { UserService } from '../user/user.service';
import { User } from '../model/entities/user.entity';
import { Post } from '../model/entities/post.entity';
import { PostRequestDto } from './dto/post.request.dto';
import { PostResponseDto } from './dto/post.response.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userService: UserService,
  ) {}

  async getPost(postId: number) {
    const post: Post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    // 조회 시 조회 수 증가
    // todo 유저당 1회
    post.viewCnt += 1;
    const savedPost = await this.postRepository.save(post);
    return PostResponseDto.newEntity(savedPost);
  }
  async updatePost(postDto: PostRequestDto, userId: number) {
    const user: User = await this.userService.getUser(userId);
    const newPost = Post.newEntity(postDto.title, postDto.content, user);
    return await this.postRepository.save(newPost);
  }
}
