import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptsController } from './attempts.controller';
import { AttemptsService } from './attempts.service';
import { Attempt } from './attempt.entity';
import { Quiz } from '../quizzes/quiz.entity';
import { Answer } from './answer.entity';
import { Question } from '../quizzes/question.entity';
import { Option } from '../quizzes/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt, Quiz, Answer, Question, Option])],
  controllers: [AttemptsController],
  providers: [AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}
