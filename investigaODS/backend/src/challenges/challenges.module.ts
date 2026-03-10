import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { Challenge } from './challenge.entity';
import { ChallengeSubmission } from './challenge-submission.entity';
import { UserPoints } from './user-points.entity';
import { Course } from '../courses/course.entity';
import { CoursesModule } from '../courses/courses.module';
import { PlansGuard } from '../common/guards/plans.guard';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, ChallengeSubmission, UserPoints, Course]),
    CoursesModule,
    SubscriptionsModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, PlansGuard, RolesGuard],
})
export class ChallengesModule {}
