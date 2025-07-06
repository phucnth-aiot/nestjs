import { IsNotEmpty, IsString } from 'class-validator';

export class logoutDto {
  @IsNotEmpty()
  @IsString()
  userid: string;
}
