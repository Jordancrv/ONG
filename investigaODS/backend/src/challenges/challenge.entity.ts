import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Course } from '../courses/course.entity';
import { Lesson } from '../lessons/lesson.entity';
import { ChallengeSubmission } from './challenge-submission.entity';

@Entity({ name: 'challenges' })
export class Challenge extends BaseEntity {
  @ManyToOne(() => Course, (course) => course.challenges, { nullable: true })
  course?: Course;

  @ManyToOne(() => Lesson, { nullable: true })
  lesson?: Lesson;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 0 })
  points!: number;

  @Column({ type: 'json', nullable: true })
  rules?: Record<string, unknown>;

  @OneToMany(() => ChallengeSubmission, (submission) => submission.challenge)
  submissions!: ChallengeSubmission[];
}
