import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from '../../common/dto/filter-task.dto';
import { Task } from './entities/task.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskResponseDto } from './dto/TaskResponseDto';
import { ErrorResponseDto } from './dto/ErrorRsponseDto';

@Controller('task')
export class TaskController {
  constructor(private readonly TasksService: TasksService) {}

  @ApiTags('tasks')
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.TasksService.create(createTaskDto);
  }
  @ApiOperation({ summary: 'Get All Task ' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @Get()
  findAll(@Query() filterTaskDto: FilterTaskDto) {
    return this.TasksService.findAll(filterTaskDto);
  }

  @ApiOperation({ summary: 'Get Task By Id' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.TasksService.findOne(id);
  }

  @ApiOperation({ summary: 'upload file' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.TasksService.uploadFile(id, file);
  }
  //   @Post(':id/upload')
  //   @UseInterceptors(FileInterceptor('file', multerConfig))
  //   async uploadFile(
  //   @Param('id') id: string,
  //   @UploadedFile() file: Express.Multer.File
  // ) {
  //   const filepath = await this.TasksService.uploadFile(file);
  //   return this.TasksService.updateTaskFile(id, filepath);
  // }
}
