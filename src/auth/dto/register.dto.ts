import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../users/users.entity';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
