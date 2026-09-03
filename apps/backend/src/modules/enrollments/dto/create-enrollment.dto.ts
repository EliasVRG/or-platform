import {
  IsUUID,
  IsOptional,
  IsDateString,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do aluno',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID do curso',
  })
  @IsUUID()
  courseId: string;

  @ApiProperty({
    example: '2026-09-10',
    description: 'Data de início da matrícula',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    example: '2026-12-10',
    description: 'Data de término da matrícula',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    example: 'active',
    description: 'Status da matrícula',
    enum: ['pending', 'active', 'canceled', 'completed'],
    default: 'pending',
    required: false,
  })
  @IsOptional()
  @IsIn(['pending', 'active', 'canceled', 'completed'])
  status?: 'pending' | 'active' | 'canceled' | 'completed';
}
