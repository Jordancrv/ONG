import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Lesson } from '../lessons/lesson.entity';

@Entity({ name: 'lesson_progress' })
export class LessonProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.progresses, { eager: true })
  lesson!: Lesson;

  @Column({ default: false })
  completed!: boolean;

  @Column({ name: 'progress_pct', type: 'int', default: 0 })
  progressPct!: number;

  @Column({ name: 'last_viewed_at', type: 'datetime', nullable: true })
  lastViewedAt?: Date;
}
