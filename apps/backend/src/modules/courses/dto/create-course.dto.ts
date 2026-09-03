import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  IsIn,
  MinLength,
  MaxLength,
  Min,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Introdução ao Node.js',
    description: 'Nome do curso',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'Aprenda Node.js do zero ao avançado',
    description: 'Descrição do curso',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 40,
    description: 'Carga horária em horas',
  })
  @IsInt()
  @Min(1)
  hours: number;

  @ApiProperty({
    example: 499.99,
    description: 'Preço do curso',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'active',
    description: 'Status do curso',
    enum: ['active', 'inactive'],
    default: 'active',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
