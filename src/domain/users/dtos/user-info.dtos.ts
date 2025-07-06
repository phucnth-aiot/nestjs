import { IsNotEmpty, IsString } from 'class-validator';

export class UserInfoDto {
  @IsNotEmpty()
  @IsString()
  userId: string;
}
