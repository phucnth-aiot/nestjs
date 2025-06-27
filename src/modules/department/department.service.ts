import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  findOne(id: string) {
    return this.departmentRepository.findOneBy({ DeptID: id });
  }

  create(dto: CreateDepartmentDto) {
    const dep = this.departmentRepository.create(dto);
    return this.departmentRepository.save(dep);
  }

  async remove(id: string) {
    await this.departmentRepository.delete(id);
  }
}
