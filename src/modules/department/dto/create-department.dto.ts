import { IsString, Length } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @Length(5, 5)
  DeptID: string;
  @IsString()
  DeptName: string;
}
