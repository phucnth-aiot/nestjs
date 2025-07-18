import { IsNotEmpty, IsString } from 'class-validator';

export default class UserChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
