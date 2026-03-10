import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Quizzes')
@Controller()
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('lessons/:id/quizzes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async create(@Param('id') id: number, @Body() dto: CreateQuizDto, @CurrentUser() user: User) {
    return this.quizzesService.createForLesson(Number(id), dto, user);
  }

  @Get('quizzes/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getQuiz(@Param('id') id: number) {
    return this.quizzesService.findOne(Number(id));
  }
}
