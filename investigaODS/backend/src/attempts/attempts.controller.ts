import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttemptsService } from './attempts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';

@ApiTags('Attempts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post('quizzes/:id/attempts')
  async startAttempt(@Param('id') id: number, @CurrentUser() user: User) {
    return this.attemptsService.startAttempt(Number(id), user);
  }

  @Post('attempts/:id/answers')
  async answer(
    @Param('id') id: number,
    @Body() dto: CreateAnswerDto,
    @CurrentUser() user: User,
  ) {
    return this.attemptsService.addAnswer(Number(id), user, dto);
  }

  @Post('attempts/:id/submit')
  async submit(@Param('id') id: number, @CurrentUser() user: User) {
    return this.attemptsService.submitAttempt(Number(id), user);
  }

  @Get('attempts/:id/result')
  async result(@Param('id') id: number, @CurrentUser() user: User) {
    return this.attemptsService.getResult(Number(id), user);
  }
}
