import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Role } from 'src/common/enums/role.enum';
@Entity({ name: 'User' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  userid: string;

  @Column()
  username: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
    nullable: true,
  })
  role: Role;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  refreshToken?: string;
}
