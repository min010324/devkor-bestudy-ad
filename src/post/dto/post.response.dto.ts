import { Post } from '../../model/entities/post.entity';

export class PostResponseDto {
  title: string;
  content: string;
  userNickname: string;
  viewCnt: number;
  likeCnt: number;
  replyCnt: number;
  regDate: Date;
  modDate: Date;
  static newEntity(post: Post) {
    const postResponseDto: PostResponseDto = new PostResponseDto();
    postResponseDto.title = post.title;
    postResponseDto.content = post.content;
    postResponseDto.userNickname = post.user.nickname;
    postResponseDto.viewCnt = post.viewCnt;
    postResponseDto.likeCnt = post.likeCnt;
    postResponseDto.replyCnt = post.replyCnt;
    postResponseDto.regDate = post.regDate;
    postResponseDto.modDate = post.modDate;
    return postResponseDto;
  }
}
