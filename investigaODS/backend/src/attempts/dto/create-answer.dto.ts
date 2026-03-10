import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAnswerDto {
  @ApiProperty()
  @IsInt()
  questionId!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  optionId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  openText?: string;
}
