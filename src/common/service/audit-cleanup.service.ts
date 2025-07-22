// audit/audit-cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuditLogService } from '../../domain/auditLog/audit-log.service';

@Injectable()
export class AuditCleanupService {
  private readonly logger = new Logger(AuditCleanupService.name);

  constructor(private readonly auditLogService: AuditLogService) {}

  @Cron('*/2 * * * *') // cron: 00:00:00 each 45 days
  async handleCron() {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 2 * 60 * 1000);
    const deleted = await this.auditLogService.deleteOlderThan(cutoffDate);
    this.logger.log(
      `🧹 Đã xoá ${deleted} bản ghi audit log trước ngày ${cutoffDate.toISOString()}`,
    );
  }
}
