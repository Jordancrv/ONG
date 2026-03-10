import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembershipPlan, MembershipPlanCode } from '../plans/membership-plan.entity';
import { Subscription, SubscriptionStatus } from './subscription.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
    @InjectRepository(MembershipPlan)
    private readonly plansRepository: Repository<MembershipPlan>,
  ) {}

  async ensureDefaultSubscription(userId: number, planCode: MembershipPlanCode) {
    const existing = await this.subscriptionsRepository.findOne({
      where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
    });
    if (existing) {
      return existing;
    }
    const plan = await this.getPlanOrCreate(planCode);
    const subscription = this.subscriptionsRepository.create({
      user: { id: userId } as any,
      plan,
      status: SubscriptionStatus.ACTIVE,
      startAt: new Date(),
    });
    const saved = await this.subscriptionsRepository.save(subscription);
    return this.stripSubscription(saved);
  }

  async findActiveSubscription(userId: number) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
    });
    return subscription ? this.stripSubscription(subscription) : null;
  }

  async upgrade(userId: number, planCode: MembershipPlanCode) {
    const plan = await this.getPlanOrCreate(planCode);
    let subscription = await this.subscriptionsRepository.findOne({
      where: { user: { id: userId }, status: SubscriptionStatus.ACTIVE },
    });
    if (!subscription) {
      subscription = this.subscriptionsRepository.create({
        user: { id: userId } as any,
        plan,
        status: SubscriptionStatus.ACTIVE,
        startAt: new Date(),
      });
    } else {
      subscription.plan = plan;
      subscription.startAt = new Date();
      subscription.endAt = undefined;
      subscription.status = SubscriptionStatus.ACTIVE;
    }
    const saved = await this.subscriptionsRepository.save(subscription);
    return this.stripSubscription(saved);
  }

  async cancel(userId: number) {
    const subscription = await this.findActiveSubscription(userId);
    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.endAt = new Date();
      await this.subscriptionsRepository.save(subscription);
    }
  }

  private async getPlanOrCreate(planCode: MembershipPlanCode) {
    let plan = await this.plansRepository.findOne({ where: { code: planCode } });
    if (!plan) {
      plan = this.plansRepository.create({
        code: planCode,
        name: planCode === MembershipPlanCode.PRO ? 'Pro' : 'Basic',
        features: planCode === MembershipPlanCode.PRO ? { live: true } : { live: false },
      });
      plan = await this.plansRepository.save(plan);
    }
    return plan;
  }

  private stripSubscription(subscription: Subscription) {
    if (subscription.user) {
      const { passwordHash, ...user } = subscription.user as any;
      subscription.user = user;
    }
    return subscription;
  }
}
