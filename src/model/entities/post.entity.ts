import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  viewCnt: number;

  @Column({ default: 0 })
  likeCnt: number;

  @Column({ default: 0 })
  replyCnt: number;

  @CreateDateColumn()
  regDate: Date;

  @UpdateDateColumn({ name: 'mod_date' })
  modDate: Date;

  @ManyToOne(() => User)
  user: User;

  static newEntity(title: string, content: string, user: User) {
    const post: Post = new Post();
    post.title = title;
    post.content = content;
    post.user = user;
    return post;
  }
}
