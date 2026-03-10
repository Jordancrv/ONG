import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveClassesController } from './live-classes.controller';
import { LiveClassesService } from './live-classes.service';
import { LiveClass } from './live-class.entity';
import { Course } from '../courses/course.entity';
import { CoursesModule } from '../courses/courses.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PlansGuard } from '../common/guards/plans.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([LiveClass, Course]),
    CoursesModule,
    SubscriptionsModule,
  ],
  controllers: [LiveClassesController],
  providers: [LiveClassesService, PlansGuard, RolesGuard],
})
export class LiveClassesModule {}
