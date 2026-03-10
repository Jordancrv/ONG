import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { QuizType } from '../quiz.entity';

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional({ enum: QuizType })
  @IsOptional()
  @IsEnum(QuizType)
  type?: QuizType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  passScore?: number;
}
