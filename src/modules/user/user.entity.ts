import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ unique: true })
  username: string | undefined;

  @Column()
  password: string | undefined;
}
