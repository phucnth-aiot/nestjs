// src/salary/salary.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common'; // cái này import mấy cái phương thức
import { SalaryService } from './salary.service';
import { Salary } from './salary.entity';

@Controller('salaries')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get()
  getAll(): Promise<Salary[]> {
    return this.salaryService.findAll();
  }

  @Post()
  create(@Body() data: Partial<Salary>): Promise<Salary> {
    return this.salaryService.create(data);
  }
}
