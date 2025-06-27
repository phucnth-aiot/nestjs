import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>
  ) {}

  // Lấy tất cả nhân viên với thông tin phòng ban và lương
  async getAllEmployeesWithDetails(month?: number, year?: number) {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.salaries', 'salary');

    // Nếu có filter theo tháng/năm
    if (month && year) {
      queryBuilder.andWhere('salary.Month = :month AND salary.Year = :year', {
        month,
        year,
      });
    } else if (year) {
      queryBuilder.andWhere('salary.Year = :year', { year });
    }

    const employees = await queryBuilder.getMany();

    return employees.map(employee => this.formatEmployeeResponse(employee));
  }

  // Lấy thông tin chi tiết một nhân viên
  async getEmployeeWithDetails(empId: string, month?: number, year?: number) {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.salaries', 'salary')
      .where('employee.EmpID = :empId', { empId });

    if (month && year) {
      queryBuilder.andWhere('salary.Month = :month AND salary.Year = :year', {
        month,
        year,
      });
    } else if (year) {
      queryBuilder.andWhere('salary.Year = :year', { year });
    }

    const employee = await queryBuilder.getOne();

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${empId} not found`);
    }

    return this.formatEmployeeResponse(employee);
  }

  // Lấy nhân viên theo phòng ban
  async getEmployeesByDepartment(
    deptId: string,
    month?: number,
    year?: number
  ) {
    const queryBuilder = this.employeeRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.salaries', 'salary')
      .where('employee.DeptID = :deptId', { deptId });

    if (month && year) {
      queryBuilder.andWhere('salary.Month = :month AND salary.Year = :year', {
        month,
        year,
      });
    } else if (year) {
      queryBuilder.andWhere('salary.Year = :year', { year });
    }

    const employees = await queryBuilder.getMany();

    return employees.map(employee => this.formatEmployeeResponse(employee));
  }

  // Format response data
  private formatEmployeeResponse(employee: Employee) {
    const totalSalary =
      employee.salaries?.reduce((total, salary) => {
        return (
          total +
          salary.BaseSalary +
          salary.Allowance +
          salary.Bonus -
          salary.Deduction
        );
      }, 0) || 0;

    const latestSalary =
      employee.salaries?.length > 0
        ? employee.salaries.sort((a, b) => {
            if (a.Year !== b.Year) return b.Year - a.Year;
            return b.Month - a.Month;
          })[0]
        : null;

    return {
      empId: employee.EmpID,
      fullName: employee.FullName,
      gender: employee.Gender,
      birthDate: employee.BirthDate,
      address: employee.Address,
      baseSalary: employee.Salary,
      department: {
        deptId: employee.department?.DeptID,
        deptName: employee.department?.DeptName,
      },
      latestSalary: latestSalary
        ? {
            month: latestSalary.Month,
            year: latestSalary.Year,
            baseSalary: latestSalary.BaseSalary,
            allowance: latestSalary.Allowance,
            bonus: latestSalary.Bonus,
            deduction: latestSalary.Deduction,
            totalSalary:
              latestSalary.BaseSalary +
              latestSalary.Allowance +
              latestSalary.Bonus -
              latestSalary.Deduction,
          }
        : null,
      allSalaries:
        employee.salaries?.map(salary => ({
          salaryId: salary.SalaryID,
          month: salary.Month,
          year: salary.Year,
          baseSalary: salary.BaseSalary,
          allowance: salary.Allowance,
          bonus: salary.Bonus,
          deduction: salary.Deduction,
          totalSalary:
            salary.BaseSalary +
            salary.Allowance +
            salary.Bonus -
            salary.Deduction,
        })) || [],
      totalSalaryAllTime: totalSalary,
    };
  }
}
