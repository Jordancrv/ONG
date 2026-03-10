import { SetMetadata } from '@nestjs/common';
import { MembershipPlanCode } from '../../plans/membership-plan.entity';

export const PLAN_KEY = 'plan';
export const RequirePlan = (plan: MembershipPlanCode) => SetMetadata(PLAN_KEY, plan);
