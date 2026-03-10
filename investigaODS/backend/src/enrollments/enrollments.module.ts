import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { Enrollment } from './enrollment.entity';
import { CoursesModule } from '../courses/courses.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment]), CoursesModule, SubscriptionsModule],
  providers: [EnrollmentsService, RolesGuard],
  controllers: [EnrollmentsController],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
