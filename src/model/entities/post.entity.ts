import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Reply } from './reply.entity';

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

  @OneToMany(() => Reply, (reply) => reply.post)
  reply: Reply[];

  static newEntity(title: string, content: string, userId: number) {
    const post: Post = new Post();
    post.title = title;
    post.content = content;

    const user = new User();
    user.id = userId;
    post.user = user;
    return post;
  }
}
