import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
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

  @Column({ name: 'status', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date;

  @UpdateDateColumn({ name: 'mod_date' })
  modDate: Date;

  static newEntity(
    nickname: string,
    email: string,
    passwordEnc: string,
    refreshToken: string,
    status?: boolean,
  ): User {
    const user = new User();
    user.nickname = nickname;
    user.email = email;
    user.passwordEnc = passwordEnc;
    user.refreshToken = refreshToken;
    user.status = status || true;
    return user;
  }
}
