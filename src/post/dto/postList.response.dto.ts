import { Post } from '../../model/entities/post.entity';
import { PostResponseDto } from './post.response.dto';

export class PostListResponseDto {
  total: number;
  page: number;
  keyword: string;
  postList: PostResponseDto[];

  static newEntity(
    total: number,
    page: number,
    keyword: string,
    postList: Post[],
  ) {
    const postListResponseDto = new PostListResponseDto();
    postListResponseDto.total = total;
    postListResponseDto.page = page;
    postListResponseDto.keyword = keyword;
    postListResponseDto.postList = postList?.map((post: Post) =>
      PostResponseDto.newEntity(post, null),
    );

    return postListResponseDto;
  }
}
