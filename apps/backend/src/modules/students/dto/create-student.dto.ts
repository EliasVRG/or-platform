import {
  IsString,
  IsEmail,
  IsOptional,
  IsIn,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do aluno',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'Email do aluno',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345678901',
    description: 'CPF do aluno (11 dígitos sem formatação)',
  })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' })
  cpf: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Telefone do aluno',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    example: 'active',
    description: 'Status do aluno',
    enum: ['active', 'inactive'],
    default: 'active',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
