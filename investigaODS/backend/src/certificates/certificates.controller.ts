import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { IssueCertificateDto } from './dto/issue-certificate.dto';

@ApiTags('Certificates')
@Controller()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('courses/:id/certificates/issue')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async issue(
    @Param('id') id: number,
    @Body() dto: IssueCertificateDto,
    @CurrentUser() user: User,
  ) {
    return this.certificatesService.issue(Number(id), dto, user);
  }

  @Get('me/certificates')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async myCertificates(@CurrentUser() user: User) {
    return this.certificatesService.listForUser(user.id);
  }

  @Get('certificates/verify')
  async verify(@Query('serial') serial: string) {
    return this.certificatesService.verify(serial);
  }
}
