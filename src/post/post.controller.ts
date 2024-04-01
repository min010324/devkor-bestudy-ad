import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponseDto } from '../util/response.dto';
import { PostRequestDto } from './dto/post.request.dto';
import { PostResponseDto } from './dto/post.response.dto';
import { ReplyRequestDto } from './dto/reply.request.dto';

@Controller('post')
@UseGuards(AuthGuard('access'))
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  async savePost(@Body() post: PostRequestDto, @Req() req: any) {
    await this.postService.updatePost(post, req.user.userId);
    return new ApiResponseDto({}, HttpStatus.OK);
  }

  @Delete(':id')
  async deletePost(@Param('id') postId: number, @Req() req: any) {
    await this.postService.deletePost(postId, req.user.userId);
    return new ApiResponseDto({}, HttpStatus.OK);
  }

  @Post('/like/:id')
  async likePost(@Param('id') postId, @Req() req: any) {
    await this.postService.likePost(postId, req.user.userId);
    return new ApiResponseDto({}, HttpStatus.OK);
  }

  @Get(':id')
  async getPost(@Param('id') postId: number, @Req() req: any) {
    const postResponseDto: PostResponseDto =
      await this.postService.getPost(postId);
    return new ApiResponseDto(postResponseDto, HttpStatus.OK);
  }

  @Post('/reply')
  async saveReply(@Body() replyRequestDto: ReplyRequestDto, @Req() req: any) {
    await this.postService.updateReply(replyRequestDto, req.user.userId);
    return new ApiResponseDto({}, HttpStatus.OK);
  }

  @Delete('/reply/:id')
  async deleteReply(@Param('id') replyId: number, @Req() req: any) {
    await this.postService.deleteReply(replyId, req.user.userId);
    return new ApiResponseDto({}, HttpStatus.OK);
  }
}
