import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { LessonProgress } from './lesson-progress.entity';
import { Lesson } from '../lessons/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LessonProgress, Lesson])],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
