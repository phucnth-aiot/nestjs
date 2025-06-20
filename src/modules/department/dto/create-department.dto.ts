import { IsString, Length } from 'class-validator';

export class CreateDepartmentDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @Length(5, 5)
  DeptID: string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsString()
  DeptName: string;
}
