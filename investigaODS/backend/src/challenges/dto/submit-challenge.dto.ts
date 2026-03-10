import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SubmitChallengeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  artifactUrl?: string;
}
