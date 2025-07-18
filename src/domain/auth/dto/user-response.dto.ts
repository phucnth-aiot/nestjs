import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({ description: 'Unique ID of the user' })
  @IsString()
  userid: string;

  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Role of the user', enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ description: 'Avatar URL of the user', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
