import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('audit-log')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs' })
  async getAllLogs() {
    return this.auditLogService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get audit logs by user' })
  @ApiOperation({ summary: 'Get audit logs by userId' })
  async getUserLogs(@Param('userId') userId: string) {
    return this.auditLogService.findByUser(userId);
  }
}
