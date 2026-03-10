import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';

@Entity({ name: 'user_points' })
export class UserPoints {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @ManyToOne(() => Course, { eager: true, nullable: true })
  course?: Course;

  @Column({ type: 'int', default: 0 })
  points!: number;
}
