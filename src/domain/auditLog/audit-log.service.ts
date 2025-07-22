import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { LessThan, Repository } from 'typeorm';
import { AuditLogDto } from './dto/audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogEntity)
    private readonly auditLogRepository: Repository<AuditLogEntity>,
  ) {}

  async logAction(auditLogDto: AuditLogDto) {
    const log = this.auditLogRepository.create(auditLogDto);
    // const ip = (req as any).clientIp || 'Unknown';
    // const ip = (req as Request & { clientIp?: string }).clientIp || 'Unknown';

    return await this.auditLogRepository.save(log);
  }
  findAll() {
    return this.auditLogRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  findByUser(userId: string) {
    return this.auditLogRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
    });
  }

  async deleteOlderThan(date: Date): Promise<number> {
    const result = await this.auditLogRepository.delete({ createdAt: LessThan(date) });
    return result.affected ?? 0;
  }
}
