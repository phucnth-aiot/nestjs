import { IsString, Length } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @Length(5, 5)
  DeptID: string | undefined;
  @IsString()
  DeptName: string | undefined;
}
