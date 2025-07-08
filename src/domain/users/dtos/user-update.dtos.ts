import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  refreshToken: string;
}
