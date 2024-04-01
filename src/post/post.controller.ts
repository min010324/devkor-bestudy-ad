import {
  Body,
  Controller,
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

@Controller('post')
@UseGuards(AuthGuard('access'))
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  async savePost(@Body() post: PostRequestDto, @Req() req: any) {
    await this.postService.updatePost(post, req.user.userId);
    return new ApiResponseDto({}, HttpStatus.OK);
  }

  @Get(':id')
  async getPost(@Param('id') postId: number, @Req() req: any) {
    const postResponseDto: PostResponseDto =
      await this.postService.getPost(postId);
    return new ApiResponseDto(postResponseDto, HttpStatus.OK);
  }
}
