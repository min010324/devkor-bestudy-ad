import { Post } from '../../model/entities/post.entity';
import { ReplyResponseDto } from './reply.response.dto';

export class PostResponseDto {
  postId: number;
  title: string;
  content: string;
  userNickname: string;
  viewCnt: number;
  likeCnt: number;
  replyCnt: number;
  regDate: Date;
  modDate: Date;
  replyList: ReplyResponseDto[];
  likeList: string[];
  static newEntity(post: Post, likeList?: string[]) {
    const postResponseDto: PostResponseDto = new PostResponseDto();
    postResponseDto.postId = post.id;
    postResponseDto.title = post.title;
    postResponseDto.content = post.content;
    postResponseDto.userNickname = post.user.nickname;
    postResponseDto.viewCnt = post.viewCnt;
    postResponseDto.likeCnt = post.likeCnt;
    postResponseDto.replyCnt = post.replyCnt;
    postResponseDto.regDate = post.regDate;
    postResponseDto.modDate = post.modDate;
    postResponseDto.likeList = likeList || [];

    const replyParentList = post.reply
      ?.filter((reply) => reply.depth == 0)
      ?.map((reply) => {
        return ReplyResponseDto.newEntity(reply);
      });

    const replyChildList = post.reply
      ?.filter((reply) => reply.depth == 1)
      ?.map((reply) => {
        return ReplyResponseDto.newEntity(reply);
      });

    replyParentList?.forEach((parentReply) => {
      parentReply.reReplyList = replyChildList?.filter(
        (child) => child.parentId == parentReply.replyId,
      );
    });

    postResponseDto.replyList = replyParentList;

    return postResponseDto;
  }
}
