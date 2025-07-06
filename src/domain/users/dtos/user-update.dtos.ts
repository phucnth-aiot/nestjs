import { IsOptional, IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty()
  @IsString()
  userid:string

  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
