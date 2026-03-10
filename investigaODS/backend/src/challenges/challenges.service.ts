import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from './challenge.entity';
import { Course } from '../courses/course.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { User } from '../users/user.entity';
import { CoursesService } from '../courses/courses.service';
import { ChallengeSubmission, ChallengeSubmissionStatus } from './challenge-submission.entity';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { UserPoints } from './user-points.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengesRepository: Repository<Challenge>,
    @InjectRepository(ChallengeSubmission)
    private readonly submissionsRepository: Repository<ChallengeSubmission>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(UserPoints)
    private readonly pointsRepository: Repository<UserPoints>,
    private readonly coursesService: CoursesService,
  ) {}

  async createForCourse(courseId: number, dto: CreateChallengeDto, user: User) {
    const course = await this.coursesRepository.findOne({ where: { id: courseId }, relations: ['owner'] });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    this.coursesService.assertCanManageCourse(course, user);
    const challenge = this.challengesRepository.create({
      course,
      title: dto.title,
      description: dto.description,
      points: dto.points ?? 0,
      rules: dto.rules,
    });
    const saved = await this.challengesRepository.save(challenge);
    return this.stripSubmissionRelations(saved);
  }

  async submit(challengeId: number, user: User, dto: SubmitChallengeDto) {
    // Load challenge with course to be able to award points on submission
    const challenge = await this.challengesRepository.findOne({ where: { id: challengeId }, relations: ['course'] });
    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }
    const submission = this.submissionsRepository.create({
      challenge,
      user,
      artifactUrl: dto.artifactUrl,
      status: ChallengeSubmissionStatus.SUBMITTED,
    });
    const saved = await this.submissionsRepository.save(submission);
    // Award points immediately upon submission
    const pointsToAward = challenge.points ?? 0;
    if (pointsToAward > 0 && challenge.course?.id) {
      await this.awardPoints(user, challenge.course.id, pointsToAward);
    }
    return this.stripSubmissionRelations(saved);
  }

  async awardPoints(user: User, courseId: number, points: number) {
    let userPoints = await this.pointsRepository.findOne({ where: { user: { id: user.id }, course: { id: courseId } } });
    if (!userPoints) {
      userPoints = this.pointsRepository.create({ user, course: { id: courseId } as any, points: 0 });
    }
    userPoints.points += points;
    const saved = await this.pointsRepository.save(userPoints);
    return this.stripPointsRelations(saved);
  }

  async listUserPoints(userId: number) {
    const points = await this.pointsRepository.find({ where: { user: { id: userId } } });
    return points.map((entry) => this.stripPointsRelations(entry));
  }

  private stripSubmissionRelations<T extends Challenge | ChallengeSubmission | UserPoints>(entity: T): T {
    if ((entity as any).user) {
      const { passwordHash, ...user } = (entity as any).user as any;
      (entity as any).user = user;
    }
    if ((entity as any).course?.owner) {
      const { passwordHash, ...owner } = (entity as any).course.owner as any;
      (entity as any).course.owner = owner;
    }
    return entity;
  }

  private stripPointsRelations(entry: UserPoints) {
    return this.stripSubmissionRelations(entry);
  }
}
