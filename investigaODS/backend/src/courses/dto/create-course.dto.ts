import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseModality, CourseTier, CourseVisibility } from '../course.entity';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ enum: CourseVisibility })
  @IsOptional()
  @IsEnum(CourseVisibility)
  visibility?: CourseVisibility;

  @ApiPropertyOptional({ enum: CourseModality })
  @IsOptional()
  @IsEnum(CourseModality)
  modality?: CourseModality;

  @ApiPropertyOptional({ enum: CourseTier })
  @IsOptional()
  @IsEnum(CourseTier)
  tierRequired?: CourseTier;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasCertificate?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  supportsLive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  supportsChallenges?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  tags?: string[];
}
