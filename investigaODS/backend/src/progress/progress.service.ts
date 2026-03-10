import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgress } from './lesson-progress.entity';
import { Lesson } from '../lessons/lesson.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly progressRepository: Repository<LessonProgress>,
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
  ) {}

  async updateProgress(lessonId: number, user: User, dto: UpdateProgressDto) {
    const lesson = await this.lessonsRepository.findOne({
      where: { id: lessonId },
      relations: ['module', 'module.course'],
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    let progress = await this.progressRepository.findOne({
      where: { lesson: { id: lessonId }, user: { id: user.id } },
    });
    if (!progress) {
      progress = this.progressRepository.create({
        lesson,
        user,
        progressPct: 0,
        completed: false,
      });
    }
    if (dto.progressPct !== undefined) {
      progress.progressPct = dto.progressPct;
    }
    if (dto.completed !== undefined) {
      progress.completed = dto.completed;
    }
    progress.lastViewedAt = new Date();
    const saved = await this.progressRepository.save(progress);
    return this.stripUser(saved);
  }

  async getCourseProgress(courseId: number, user: User) {
    // First, verify if the course exists and get total lessons
    const totalLessons = await this.lessonsRepository
      .createQueryBuilder('lesson')
      .innerJoin('lesson.module', 'module')
      .innerJoin('module.course', 'course')
      .where('course.id = :courseId', { courseId })
      .getCount();

    if (totalLessons === 0) {
      throw new NotFoundException(`Course with ID ${courseId} not found or has no lessons`);
    }

    // Get all progress entries for the user in this course
    const progress = await this.progressRepository
      .createQueryBuilder('progress')
      .innerJoinAndSelect('progress.lesson', 'lesson')
      .innerJoinAndSelect('lesson.module', 'module')
      .innerJoinAndSelect('module.course', 'course')
      .where('course.id = :courseId', { courseId })
      .andWhere('progress.user = :userId', { userId: user.id })
      .getMany();

    const completedLessons = progress.filter((p: LessonProgress) => p.completed).length;
    
    return {
      courseId,
      totalLessons,
      completedLessons,
      progressPercentage: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      lessonProgress: progress.map((entry: LessonProgress) => this.stripUser(entry))
    };
  }

  private stripUser(entry: LessonProgress) {
    if (entry.user) {
      const { passwordHash, ...user } = entry.user as any;
      entry.user = user;
    }
    return entry;
  }
}
