import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Challenge } from './challenge.entity';
import { User } from '../users/user.entity';

export enum ChallengeSubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWING = 'REVIEWING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity({ name: 'challenge_submissions' })
export class ChallengeSubmission {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Challenge, (challenge) => challenge.submissions, { eager: true })
  challenge!: Challenge;

  @ManyToOne(() => User, { eager: true })
  user!: User;

  @Column({ name: 'artifact_url', nullable: true })
  artifactUrl?: string;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ type: 'enum', enum: ChallengeSubmissionStatus, default: ChallengeSubmissionStatus.SUBMITTED })
  status!: ChallengeSubmissionStatus;
}
