import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password for the user account' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Role of the user', enum: Role, default: Role.User })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ description: 'Avatar URL of the user', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
