import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PLAN_KEY } from '../decorators/plans.decorator';
import { MembershipPlanCode } from '../../plans/membership-plan.entity';
import { SubscriptionsService } from '../../subscriptions/subscriptions.service';
import { UserRole } from '../../users/user-role.enum';

@Injectable()
export class PlansGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlan = this.reflector.getAllAndOverride<MembershipPlanCode>(PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPlan) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }
    
    // Instructores y Administradores tienen acceso completo sin restricciones de plan
    if (user.role === UserRole.INSTRUCTOR || user.role === UserRole.ADMIN) {
      return true;
    }
    const subscription = await this.subscriptionsService.findActiveSubscription(user.id);
    if (!subscription) {
      throw new ForbiddenException('Active subscription required');
    }
    if (requiredPlan === MembershipPlanCode.BASIC) {
      return true;
    }
    if (requiredPlan === MembershipPlanCode.PRO && subscription.plan.code === MembershipPlanCode.PRO) {
      return true;
    }
    throw new ForbiddenException('Upgrade plan required');
  }
}
