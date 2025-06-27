// src/salary/salary.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salary } from './salary.entity';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(Salary)
    private readonly salaryRepository: Repository<Salary>
  ) {}

  findAll(): Promise<Salary[]> {
    return this.salaryRepository.find({ relations: ['employee'] });
  }

  create(data: Partial<Salary>): Promise<Salary> {
    const salary = this.salaryRepository.create(data);
    return this.salaryRepository.save(salary);
  }
}
