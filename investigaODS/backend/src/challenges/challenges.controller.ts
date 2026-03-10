import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { RequirePlan } from '../common/decorators/plans.decorator';
import { MembershipPlanCode } from '../plans/membership-plan.entity';
import { PlansGuard } from '../common/guards/plans.guard';

@ApiTags('Challenges')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PlansGuard)
@RequirePlan(MembershipPlanCode.PRO)
@Controller()
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post('courses/:courseId/challenges')
  @UseGuards(JwtAuthGuard, PlansGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async create(
    @Param('courseId') courseId: number,
    @Body() dto: CreateChallengeDto,
    @CurrentUser() user: User,
  ) {
    return this.challengesService.createForCourse(Number(courseId), dto, user);
  }

  @Post('challenges/:id/submissions')
  async submit(
    @Param('id') id: number,
    @Body() dto: SubmitChallengeDto,
    @CurrentUser() user: User,
  ) {
    return this.challengesService.submit(Number(id), user, dto);
  }

  @Get('me/points')
  async points(@CurrentUser() user: User) {
    return this.challengesService.listUserPoints(user.id);
  }
}
