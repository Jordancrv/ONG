import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './course.entity';
import { CourseModule } from './course-module.entity';
import { Lesson } from '../lessons/lesson.entity';
import { Tag } from '../tags/tag.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Enrollment } from '../enrollments/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, CourseModule, Lesson, Tag, Enrollment])],
  controllers: [CoursesController],
  providers: [CoursesService, RolesGuard],
  exports: [CoursesService],
})
export class CoursesModule {}
