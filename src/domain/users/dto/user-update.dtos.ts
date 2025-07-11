import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({ description: 'Username of the user', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Phone number of the user', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Email address of the user', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Password for the user account', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Role of the user', enum: Role, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ description: 'Avatar URL of the user', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
