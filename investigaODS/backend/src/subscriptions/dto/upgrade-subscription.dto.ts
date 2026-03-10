import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MembershipPlanCode } from '../../plans/membership-plan.entity';

export class UpgradeSubscriptionDto {
  @ApiProperty({ enum: MembershipPlanCode })
  @IsEnum(MembershipPlanCode)
  planCode!: MembershipPlanCode;
}
