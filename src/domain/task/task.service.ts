import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from '../../common/dto/filter-task.dto';
import { Express } from 'express';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { logger } from 'src/config/logger';
import { FileService } from 'src/common/service/uploadFile';

@Injectable()
export class TasksService {
  storagePath: any;
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,

    private readonly fileService: FileService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.taskRepository.create(createTaskDto);
      const savedTask = await this.taskRepository.save(task);

      logger.info('Task created successfully', {
        taskId: savedTask.id,
        title: savedTask.title,
        payload: createTaskDto,
      });

      return savedTask;
    } catch (error) {
      logger.error('Failed to create task', {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error: error.message as string,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        stack: error.stack as string,
        payload: createTaskDto,
      });
      throw error;
    }
  }

  // tìm tất cả và phân trang
  async findAll(filterDto: FilterTaskDto) {
    const { status, title, page = '1', limit = '10' } = filterDto;

    // Tạo cache key dựa trên filter
    const cacheKey = `tasks:${JSON.stringify(filterDto)}`;

    // Kiểm tra cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Lấy dữ liệu từ cache Redis', cached);
      return cached;
    }

    const where: Partial<Record<keyof Task, any>> = {};
    if (status) where.status = status;
    if (title) where.title = Like(`%${title}%`);

    const [data, total] = await this.taskRepository.findAndCount({
      where,
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      order: { createdAt: 'DESC' },
    });

    const result = {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
      },
    };
    await this.cacheManager.set(cacheKey, result, 1800);
    return result;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async uploadFile(taskId: number, file: Express.Multer.File) {
    const fileName = await this.fileService.uploadFile('task', taskId, file);

    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`taskId: ${taskId} not found`);
    }

    task.fileUrl = fileName;

    await this.taskRepository.save(task);

    return {
      message: 'Upload successful!',
      filename: fileName,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
