import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { Course } from './course.entity';
import { Lesson } from '../lessons/lesson.entity';

@Entity({ name: 'course_modules' })
export class CourseModule extends BaseEntity {
  @ManyToOne(() => Course, (course) => course.modules, { onDelete: 'CASCADE' })
  course!: Course;

  @Column()
  index!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  summary?: string;

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons!: Lesson[];
}
