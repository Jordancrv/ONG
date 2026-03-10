import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@ApiTags('Enrollments')
@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('courses/:id/enroll')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async enroll(@Param('id') id: number, @CurrentUser() user: User) {
    return this.enrollmentsService.enroll(Number(id), user);
  }

  @Get('me/enrollments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async myEnrollments(@CurrentUser() user: User) {
    return this.enrollmentsService.listForUser(user.id);
  }

  @Get('courses/:id/students')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async students(@Param('id') id: number, @CurrentUser() user: User) {
    return this.enrollmentsService.listStudents(Number(id), user);
  }
}
