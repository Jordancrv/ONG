import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity';
import { User } from '../users/user.entity';
import { Course } from '../courses/course.entity';
import { Cohort } from '../cohorts/cohort.entity';

@Entity({ name: 'certificates' })
export class Certificate extends BaseEntity {
  @ManyToOne(() => User, (user) => user.certificates, { eager: true })
  user!: User;

  @ManyToOne(() => Course, (course) => course.certificates, { eager: true })
  course!: Course;

  @ManyToOne(() => Cohort, (cohort) => cohort.certificates, { eager: true, nullable: true })
  cohort?: Cohort;

  @Column({ unique: true })
  serial!: string;

  @Column({ name: 'pdf_url', nullable: true })
  pdfUrl?: string;

  @Column({ name: 'hash_sha256', nullable: true })
  hashSha256?: string;

  @Column({ name: 'issued_at', type: 'datetime' })
  issuedAt!: Date;
}
