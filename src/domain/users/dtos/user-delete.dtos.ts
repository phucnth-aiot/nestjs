import { IsNotEmpty, IsString } from 'class-validator';

export class UserDeleteDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
