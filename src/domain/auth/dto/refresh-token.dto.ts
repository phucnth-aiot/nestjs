import { IsNotEmpty, IsString } from 'class-validator';

export class refreshTokenDto {
  @IsNotEmpty()
  @IsString()
  userid: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
