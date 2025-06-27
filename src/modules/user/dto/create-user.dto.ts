import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string | undefined;

  @IsNotEmpty()
  @MinLength(6)
  password: string | undefined;
}
