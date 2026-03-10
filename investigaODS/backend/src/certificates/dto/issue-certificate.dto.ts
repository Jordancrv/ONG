import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class IssueCertificateDto {
  @ApiProperty()
  @IsInt()
  userId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  cohortId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pdfUrl?: string;
}
