import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Lesson } from '../lessons/lesson.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { User } from '../users/user.entity';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizzesRepository: Repository<Quiz>,
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    private readonly coursesService: CoursesService,
  ) {}

  async createForLesson(lessonId: number, dto: CreateQuizDto, user: User) {
    const lesson = await this.lessonsRepository.findOne({
      where: { id: lessonId },
      relations: ['module', 'module.course', 'module.course.owner'],
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    this.coursesService.assertCanManageCourse(lesson.module.course, user);
    const quiz = this.quizzesRepository.create({
      ...dto,
      lesson,
      course: lesson.module.course,
    });
    const saved = await this.quizzesRepository.save(quiz);
    return this.stripSensitive(saved);
  }

  async findOne(id: number) {
    const quiz = await this.quizzesRepository.findOne({
      where: { id },
      relations: ['lesson', 'questions', 'questions.options'],
    });
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
    return this.stripSensitive(quiz);
  }

  private stripSensitive(quiz: Quiz) {
    if (quiz.course?.owner) {
      const { passwordHash, ...owner } = quiz.course.owner as any;
      quiz.course.owner = owner;
    }
    return quiz;
  }
}
