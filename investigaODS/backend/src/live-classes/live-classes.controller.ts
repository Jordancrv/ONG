import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LiveClassesService } from './live-classes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateLiveClassDto } from './dto/create-live-class.dto';
import { RequirePlan } from '../common/decorators/plans.decorator';
import { MembershipPlanCode } from '../plans/membership-plan.entity';
import { PlansGuard } from '../common/guards/plans.guard';

@ApiTags('Live Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PlansGuard)
@RequirePlan(MembershipPlanCode.PRO)
@Controller('courses/:courseId/live-classes')
export class LiveClassesController {
  constructor(private readonly liveClassesService: LiveClassesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PlansGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async create(
    @Param('courseId') courseId: number,
    @Body() dto: CreateLiveClassDto,
    @CurrentUser() user: User,
  ) {
    return this.liveClassesService.createForCourse(Number(courseId), dto, user);
  }

  @Get()
  async list(@Param('courseId') courseId: number) {
    return this.liveClassesService.listForCourse(Number(courseId));
  }
}
