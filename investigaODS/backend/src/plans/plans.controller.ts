import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UpgradeSubscriptionDto } from '../subscriptions/dto/upgrade-subscription.dto';

@ApiTags('Plans')
@Controller()
export class PlansController {
  constructor(
    private readonly plansService: PlansService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  @Get('plans')
  async getPlans() {
    return this.plansService.findAll();
  }

  @Get('me/subscription')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMySubscription(@CurrentUser() user: User) {
    return this.subscriptionsService.findActiveSubscription(user.id);
  }

  @Post('subscriptions/upgrade')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async upgrade(@CurrentUser() user: User, @Body() dto: UpgradeSubscriptionDto) {
    return this.subscriptionsService.upgrade(user.id, dto.planCode);
  }
}
