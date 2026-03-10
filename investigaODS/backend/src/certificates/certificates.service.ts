import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certificate } from './certificate.entity';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { Cohort } from '../cohorts/cohort.entity';
import { IssueCertificateDto } from './dto/issue-certificate.dto';
import { User } from '../users/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificatesRepository: Repository<Certificate>,
    @InjectRepository(Cohort)
    private readonly cohortsRepository: Repository<Cohort>,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async issue(courseId: number, dto: IssueCertificateDto, issuer: User) {
    const course = await this.coursesService.findById(courseId);
    this.coursesService.assertCanManageCourse(course, issuer);
    const student = await this.usersService.findById(dto.userId);
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    const cohort = dto.cohortId
      ? await this.cohortsRepository.findOne({ where: { id: Number(dto.cohortId) } })
      : undefined;
    const certificate = this.certificatesRepository.create({
      course,
      user: student,
      cohort: cohort ?? undefined,
      pdfUrl: dto.pdfUrl,
      serial: randomUUID(),
      issuedAt: new Date(),
    });
    const saved = await this.certificatesRepository.save(certificate);
    return this.stripRelations(saved);
  }

  async listForUser(userId: number) {
    const certificates = await this.certificatesRepository.find({ where: { user: { id: userId } } });
    return certificates.map((certificate) => this.stripRelations(certificate));
  }

  async verify(serial: string) {
    const certificate = await this.certificatesRepository.findOne({ where: { serial } });
    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }
    return this.stripRelations(certificate);
  }

  private stripRelations(certificate: Certificate) {
    if (certificate.user) {
      const { passwordHash, ...user } = certificate.user as any;
      certificate.user = user;
    }
    if (certificate.course?.owner) {
      const { passwordHash, ...owner } = certificate.course.owner as any;
      certificate.course.owner = owner;
    }
    return certificate;
  }
}
