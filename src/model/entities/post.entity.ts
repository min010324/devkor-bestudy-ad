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

  @Column({ name: 'nickname' })
  nickname: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password_enc' })
  passwordEnc: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date;

  @UpdateDateColumn({ name: 'mod_date' })
  modDate: Date;
}
