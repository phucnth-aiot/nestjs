// src/salary/salary.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity()
export class Salary {
  @PrimaryGeneratedColumn()
  SalaryID: number;

  @Column()
  EmpID: string;

  @Column()
  Month: number;

  @Column()
  Year: number;

  @Column()
  BaseSalary: number;

  @Column()
  Allowance: number;

  @Column()
  Bonus: number;

  @Column()
  Deduction: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'EmpID' })
  employee: Employee;
}
