import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../users.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
