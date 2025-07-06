// src/tasks/dto/task-response.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'My task title' })
  title: string;

  @ApiProperty({ example: 'Details about the task', required: false })
  description?: string;

  @ApiProperty({ example: 'OPEN' })
  status: string;

  @ApiProperty({ example: 'task-1-1720089502345.jpg', required: false })
  fileUrl?: string;

  @ApiProperty({ example: '2025-07-04T14:31:20.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-04T14:31:20.000Z' })
  updatedAt: Date;
}
