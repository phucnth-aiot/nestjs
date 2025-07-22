import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TasksService } from './task.service';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from 'src/common/service/uploadFile.service';

@Module({
  controllers: [TaskController],
  providers: [TasksService, FileService],
  imports: [TypeOrmModule.forFeature([Task])],
})
export class TaskModule {}
