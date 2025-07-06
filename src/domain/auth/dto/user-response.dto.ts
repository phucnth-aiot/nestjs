import { IsNotEmpty, IsString } from 'class-validator';

// user-response.dto.ts
export class UserResponseDto {
  @IsNotEmpty()
  @IsString()
  userid: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsString()
  avatarUrl?: string;
}
