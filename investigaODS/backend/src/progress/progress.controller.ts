import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';

@ApiTags('Progress')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lessons/:id/progress')
  async updateProgress(@Param('id') id: number, @CurrentUser() user: User, @Body() dto: UpdateProgressDto) {
    return this.progressService.updateProgress(Number(id), user, dto);
  }

  @Get('me/courses/:courseId')
  async courseProgress(@Param('courseId') courseId: number, @CurrentUser() user: User) {
    return this.progressService.getCourseProgress(Number(courseId), user);
  }
}
