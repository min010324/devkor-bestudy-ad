import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { Post } from '../model/entities/post.entity';
import { PostRequestDto } from './dto/post.request.dto';
import { PostResponseDto } from './dto/post.response.dto';
import { ReplyRepository } from './reply.repository';
import { ReplyRequestDto } from './dto/reply.request.dto';
import { Reply } from '../model/entities/reply.entity';
import { LikePostRepository } from './likePost.repository';
import { LikePost } from '../model/entities/likePost.entity';
import { SortType } from '../type/post.type';
import { PAGING_LIMIT } from '../util/util';
import { Like } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { PostListResponseDto } from './dto/postList.response.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly likePostRepository: LikePostRepository,
    private readonly replyRepository: ReplyRepository,
  ) {}

  async getPost(postId: number) {
    const post: Post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new BadRequestException('존재하지 않는 게시글입니다.');
    }
    if (!post.status) {
      throw new BadRequestException('이미 삭제된 게시글입니다.');
    }

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

    const likeList = await this.likePostRepository.find({
      where: { postId: post.id },
      relations: ['user'],
    });
    const likeUserNameList = likeList.map((likeUser) => likeUser.user.nickname);

    return PostResponseDto.newEntity(savedPost, likeUserNameList);
  }

  async getPostList(
    keyword: string,
    sort: SortType = SortType.DATE,
    page: number = 1,
  ) {
    let whereOption: FindOptionsWhere<Post> = {
      status: true,
    };
    if (keyword) {
      whereOption = { ...whereOption, content: Like(`%${keyword}%`) };
    }
    const [postList, total] = await this.postRepository.findAndCount({
      where: whereOption,
      order: { regDate: 'ASC' },
      take: PAGING_LIMIT,
      skip: (page - 1) * PAGING_LIMIT,
      relations: ['user'],
    });

    console.log('sort', sort);

    if (sort == SortType.LIKE) {
      postList.sort((prev: Post, next: Post) => {
        return next.likeCnt - prev.likeCnt;
      });
    }

    if (sort == SortType.VIEW) {
      postList.sort((prev: Post, next: Post) => {
        return next.viewCnt - prev.viewCnt;
      });
    }

    return PostListResponseDto.newEntity(total, page, keyword, postList);
  }

  async updatePost(postDto: PostRequestDto, userId: number) {
    // const user: User = await this.userService.getUser(userId);
    const newPost = Post.newEntity(postDto.title, postDto.content, userId);
    return await this.postRepository.save(newPost);
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) {
      throw new BadRequestException('존재하지 않는 게시글입니다.');
    }
    if (post.user.id !== userId) {
      throw new UnauthorizedException('본인이 작성한 게시글이 아닙니다.');
    }
    post.status = false;
    return await this.postRepository.save(post);
  }

  async likePost(postId: number, userId: number) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    const existLike = await this.likePostRepository.findOne({
      where: { userId: userId, postId: postId },
    });
    if (existLike) {
      await this.likePostRepository.remove(existLike);
      post.likeCnt -= 1;
    } else {
      const likePost = LikePost.newEntity(userId, postId);
      await this.likePostRepository.save(likePost);
      post.likeCnt += 1;
    }

    await this.postRepository.save(post);
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
      relations: ['user', 'post'],
    });

    if (!reply) {
      throw new BadRequestException('존재하지 않는 댓글입니다.');
    }
    if (reply.user.id !== userId) {
      throw new UnauthorizedException('본인이 작성한 댓글이 아닙니다.');
    }

    reply.status = false;
    await this.replyRepository.save(reply);

    reply.post.replyCnt -= 1;
    await this.postRepository.save(reply.post);
  }
}
