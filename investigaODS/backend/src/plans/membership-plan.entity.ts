import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Subscription } from '../subscriptions/subscription.entity';

export enum MembershipPlanCode {
  BASIC = 'BASIC',
  PRO = 'PRO',
}

@Entity({ name: 'membership_plans' })
export class MembershipPlan extends BaseEntity {
  @Column({ type: 'enum', enum: MembershipPlanCode, unique: true })
  code!: MembershipPlanCode;

  @Column()
  name!: string;

  @Column({ type: 'json', nullable: true })
  features?: Record<string, unknown>;

  @Column({ default: true })
  status!: boolean;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions!: Subscription[];
}
