import { IsDate, IsOptional, IsString } from 'class-validator';
import { Action } from 'src/common/enums/action.enum';

export class AuditLogDto {
  @IsString()
  userId: string;
  @IsString()
  username: string;
  action: Action;
  @IsString()
  entityName?: string;
  @IsOptional()
  ipAddress?: string;
  @IsDate()
  createdAt: Date;
}
