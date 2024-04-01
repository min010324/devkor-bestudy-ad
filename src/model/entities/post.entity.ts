import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'view_cnt' })
  viewCnt: number;

  @Column({ name: 'like_cnt' })
  likeCnt: number;

  @Column({ name: 'reply_cnt' })
  replyCnt: number;

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date;

  @UpdateDateColumn({ name: 'mod_date' })
  modDate: Date;
}
