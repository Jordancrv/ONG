import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { Quiz } from './quiz.entity';
import { Lesson } from '../lessons/lesson.entity';
import { CoursesModule } from '../courses/courses.module';
import { Question } from './question.entity';
import { Option } from './option.entity';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Lesson, Question, Option]), CoursesModule],
  controllers: [QuizzesController],
  providers: [QuizzesService, RolesGuard],
  exports: [QuizzesService],
})
export class QuizzesModule {}
