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

@Entity('reply')
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  parentId: number;

  @Column({ default: 0 })
  depth: number;

  @Column()
  content: string;

  @Column({ default: true })
  status: boolean;

  @CreateDateColumn()
  regDate: Date;

  @UpdateDateColumn()
  modDate: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post)
  post: Post;

  static newEntity(
    content: string,
    parentId: number,
    postId: number,
    userId: number,
  ) {
    const reply: Reply = new Reply();
    reply.content = content;

    // 답글
    reply.parentId = parentId > 0 ? parentId : null;
    if (parentId && parentId > 0) {
      reply.depth = 1;
    }

    const user = new User();
    user.id = userId;
    const post = new Post();
    post.id = postId;

    reply.user = user;
    reply.post = post;
    return reply;
  }
}
