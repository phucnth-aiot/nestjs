import { Action } from 'src/common/enums/action.enum';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  username: string;

  @Column({
    type: 'enum',
    enum: Action,
  })
  action: Action;

  @Column({ nullable: true })
  entityName: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;
}
