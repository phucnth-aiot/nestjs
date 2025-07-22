import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { AuditCleanupService } from 'src/common/service/audit-cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [AuditLogService, AuditCleanupService],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}
