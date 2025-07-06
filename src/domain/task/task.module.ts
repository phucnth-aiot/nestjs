import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TasksService } from './task.service';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TaskController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([Task])],
})
export class TaskModule {}
