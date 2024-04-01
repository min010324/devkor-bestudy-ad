import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('like_post')
export class LikePost {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  regDate: Date;

  @UpdateDateColumn({ name: 'mod_date' })
  modDate: Date;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Post)
  post: Post;

  @Column()
  postId: number;

  static newEntity(userId: number, postId: number) {
    const post: Post = new Post();
    post.id = postId;

    const user = new User();
    user.id = userId;

    const likePost = new LikePost();
    likePost.user = user;
    likePost.post = post;
    return likePost;
  }
}
