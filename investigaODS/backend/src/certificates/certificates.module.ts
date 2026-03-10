import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { Certificate } from './certificate.entity';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
import { Cohort } from '../cohorts/cohort.entity';
import { RolesGuard } from '../common/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, Cohort]), CoursesModule, UsersModule],
  controllers: [CertificatesController],
  providers: [CertificatesService, RolesGuard],
  exports: [CertificatesService],
})
export class CertificatesModule {}
