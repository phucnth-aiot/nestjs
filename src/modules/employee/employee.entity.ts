import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Department } from '../department/department.entity';
import { Salary } from '../salary/salary.entity';

@Entity()
export class Employee {
  @PrimaryColumn({ type: 'char', length: 5 })
  EmpID: string;

  @Column({ type: 'nvarchar', length: 100 })
  FullName: string;

  @Column({ type: 'nvarchar', length: 10, nullable: true })
  Gender: string;

  @Column({ type: 'date', nullable: true })
  BirthDate: Date;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  Address: string;

  @Column({ type: 'char', length: 5, nullable: true })
  DeptID: string;

  @Column({ type: 'float', nullable: true })
  Salary: number;

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'DeptID' })
  department: Department;

  @OneToMany(() => Salary, (salary) => salary.employee)
  salaries: Salary[];
}
