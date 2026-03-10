import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Course } from '../courses/course.entity';
import { Lesson } from '../lessons/lesson.entity';
import { Question } from './question.entity';
import { Attempt } from '../attempts/attempt.entity';

export enum QuizType {
  QUIZ = 'QUIZ',
  EXAM = 'EXAM',
}

@Entity({ name: 'quizzes' })
export class Quiz extends BaseEntity {
  @ManyToOne(() => Course, { nullable: true })
  course?: Course;

  @ManyToOne(() => Lesson, (lesson) => lesson.quizzes, { nullable: true })
  lesson?: Lesson;

  @Column()
  title!: string;

  @Column({ type: 'enum', enum: QuizType, default: QuizType.QUIZ })
  type!: QuizType;

  @Column({ name: 'pass_score', type: 'int', nullable: true })
  passScore?: number;

  @Column({ name: 'attempt_limit', type: 'int', nullable: true })
  attemptLimit?: number;

  @Column({ name: 'time_limit_sec', type: 'int', nullable: true })
  timeLimitSec?: number;

  @Column({ type: 'int', nullable: true })
  weight?: number;

  @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
  questions!: Question[];

  @OneToMany(() => Attempt, (attempt) => attempt.quiz)
  attempts!: Attempt[];
}
