import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseModality, CourseTier } from '../course.entity';

export class CourseFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ enum: CourseModality })
  @IsOptional()
  @IsEnum(CourseModality)
  modality?: CourseModality;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiPropertyOptional({ enum: CourseTier })
  @IsOptional()
  @IsEnum(CourseTier)
  tier?: CourseTier;
}
