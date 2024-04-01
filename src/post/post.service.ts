import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { UserService } from '../user/user.service';
import { Post } from '../model/entities/post.entity';
import { PostRequestDto } from './dto/post.request.dto';
import { PostResponseDto } from './dto/post.response.dto';
import { ReplyRepository } from './reply.repository';
import { ReplyRequestDto } from './dto/reply.request.dto';
import { Reply } from '../model/entities/reply.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly replyRepository: ReplyRepository,
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

    // 유저 정보를 포함하여 유저 정보 가져옴
    const replyList = await this.replyRepository.find({
      where: { postId: post.id },
      relations: ['user'],
      order: { regDate: 'ASC' },
    });
    savedPost.reply = replyList;

    return PostResponseDto.newEntity(savedPost);
  }

  async updatePost(postDto: PostRequestDto, userId: number) {
    // const user: User = await this.userService.getUser(userId);
    const newPost = Post.newEntity(postDto.title, postDto.content, userId);
    return await this.postRepository.save(newPost);
  }

  async updateReply(replyDto: ReplyRequestDto, userId: number) {
    if (replyDto?.parentId && replyDto.parentId > 0) {
      await this.validateParentReply(replyDto);
    }

    const post: Post = await this.postRepository.findOne({
      where: { id: replyDto.postId },
    });
    post.replyCnt += 1;
    await this.postRepository.save(post);

    const newReply = Reply.newEntity(
      replyDto.content,
      replyDto?.parentId,
      replyDto.postId,
      userId,
    );

    return await this.replyRepository.save(newReply);
  }

  private async validateParentReply(replyDto: ReplyRequestDto) {
    const parentReply = await this.replyRepository.findOne({
      where: { id: replyDto.parentId },
      relations: ['post'],
    });

    if (!parentReply) {
      throw new BadRequestException('요청하신 댓글이 존재하지 않습니다.');
    }

    if (parentReply.post.id !== replyDto.postId) {
      throw new BadRequestException('요청하신 게시글 id가 잘못되었습니다.');
    }
  }

  async deleteReply(replyId: number, userId: number) {
    const reply = await this.replyRepository.findOne({
      where: { id: replyId },
      relations: ['user'],
    });

    if (!reply) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }
    if (reply.user.id !== userId) {
      throw new UnauthorizedException('본인이 작성한 댓글이 아닙니다.');
    }

    reply.status = false;
    await this.replyRepository.save(reply);
  }
}
