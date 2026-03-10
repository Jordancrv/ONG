import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipPlan } from './membership-plan.entity';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipPlan]), SubscriptionsModule],
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService, TypeOrmModule],
})
export class PlansModule {}
