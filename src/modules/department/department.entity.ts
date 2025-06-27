import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity()
export class Department {
  @PrimaryColumn({ type: 'char', length: 5 })
  DeptID: string | undefined;

  @Column({ type: 'nvarchar', length: 100 })
  DeptName: string | undefined;

  @Column({ type: 'int', nullable: true })
  LocationID: number | undefined;

  //Một phòng ban có thể có nhiều nhân viên
  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[] | undefined;
}
