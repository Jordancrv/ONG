import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async record(action: string, metadata?: Record<string, unknown>, userId?: number) {
    const audit = this.auditRepository.create({
      action,
      metadata,
      user: userId ? ({ id: userId } as any) : undefined,
    });
    await this.auditRepository.save(audit);
  }
}
