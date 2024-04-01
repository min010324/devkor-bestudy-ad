import { Reply } from '../../model/entities/reply.entity';

export class ReplyResponseDto {
  replyId: number;
  parentId: number;
  content: string;
  userNickName: string;
  regDate: Date;
  modDate: Date;
  reReplyList: ReplyResponseDto[];

  static newEntity(reply: Reply) {
    const replyResponseDto: ReplyResponseDto = new ReplyResponseDto();
    replyResponseDto.replyId = reply.id;
    replyResponseDto.parentId = reply.parentId;
    replyResponseDto.content = reply.status
      ? reply.content
      : '삭제된 댓글입니다.';
    replyResponseDto.userNickName = reply.status ? reply.user.nickname : '';
    replyResponseDto.regDate = reply.status ? reply.regDate : null;
    replyResponseDto.modDate = reply.status ? reply.modDate : null;
    return replyResponseDto;
  }
}
