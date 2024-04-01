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
    replyResponseDto.content = reply.content;
    replyResponseDto.userNickName = reply.user.nickname;
    replyResponseDto.regDate = reply.regDate;
    replyResponseDto.modDate = reply.modDate;
    return replyResponseDto;
  }
}
