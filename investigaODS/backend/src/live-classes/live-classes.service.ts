import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveClass } from './live-class.entity';
import { Course } from '../courses/course.entity';
import { CreateLiveClassDto } from './dto/create-live-class.dto';
import { CoursesService } from '../courses/courses.service';
import { User } from '../users/user.entity';

@Injectable()
export class LiveClassesService {
  constructor(
    @InjectRepository(LiveClass)
    private readonly liveClassesRepository: Repository<LiveClass>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    private readonly coursesService: CoursesService,
  ) {}

  async createForCourse(courseId: number, dto: CreateLiveClassDto, user: User) {
    const course = await this.coursesRepository.findOne({ where: { id: courseId }, relations: ['owner'] });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    this.coursesService.assertCanManageCourse(course, user);
    const liveClass = this.liveClassesRepository.create({
      course,
      title: dto.title,
      startAt: new Date(dto.startAt),
      endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      meetingUrl: dto.meetingUrl,
      capacity: dto.capacity,
      timezone: dto.timezone,
    });
    const saved = await this.liveClassesRepository.save(liveClass);
    return this.stripCourseOwner(saved);
  }

  async listForCourse(courseId: number) {
    const liveClasses = await this.liveClassesRepository.find({ where: { course: { id: courseId } } });
    return liveClasses.map((liveClass) => this.stripCourseOwner(liveClass));
  }

  private stripCourseOwner(liveClass: LiveClass) {
    if (liveClass.course?.owner) {
      const { passwordHash, ...owner } = liveClass.course.owner as any;
      liveClass.course.owner = owner;
    }
    return liveClass;
  }
}
