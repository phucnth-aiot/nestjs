import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FilterTaskDto {
  @ApiProperty({
    example: 'Pending',
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 'Task 1',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: '1,2,3...',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({
    example: '5,10,15...',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
