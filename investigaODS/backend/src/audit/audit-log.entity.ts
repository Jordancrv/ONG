import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'audit_logs' })
export class AuditLog extends BaseEntity {
  @ManyToOne(() => User, { nullable: true })
  user?: User | null;

  @Column({ length: 255 })
  action!: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, unknown> | null;
}
