import { Controller, Get, Param, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  // Lấy tất cả nhân viên với thông tin phòng ban và lương
  @Get()
  async getAllEmployeesWithDetails(
    @Query('month') month?: number,
    @Query('year') year?: number
  ) {
    return this.employeeService.getAllEmployeesWithDetails(month, year);
  }

  // Lấy thông tin chi tiết một nhân viên theo ID
  @Get(':id')
  async getEmployeeWithDetails(
    @Param('id') id: string,
    @Query('month') month?: number,
    @Query('year') year?: number
  ) {
    return this.employeeService.getEmployeeWithDetails(id, month, year);
  }

  // Lấy nhân viên theo phòng ban
  @Get('department/:deptId')
  async getEmployeesByDepartment(
    @Param('deptId') deptId: string,
    @Query('month') month?: number,
    @Query('year') year?: number
  ) {
    return this.employeeService.getEmployeesByDepartment(deptId, month, year);
  }
}
