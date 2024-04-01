import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('auth_code')
export class AuthCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'auth_code' })
  authCode: string;

  @CreateDateColumn({ name: 'reg_date' })
  regDate: Date;

  static newEntity(email: string, code: string): AuthCode {
    const authCodeEntity = new AuthCode();
    authCodeEntity.email = email;
    authCodeEntity.authCode = code;
    return authCodeEntity;
  }
}
