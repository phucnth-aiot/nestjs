import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Task 1',
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'Code API for user CRUD',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Pending',
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '2025-07-04',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
