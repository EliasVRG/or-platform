import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsRepository } from './students.repository';
import { CreateStudentDto } from './dto/create-student.dto';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

describe('StudentsService', () => {
  let service: StudentsService;
  let repository: jest.Mocked<StudentsRepository>;

  const mockStudent = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'João Silva',
    email: 'joao@example.com',
    cpf: '12345678901',
    phone: '11999999999',
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollments: [] as any[],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        {
          provide: StudentsRepository,
          useValue: {
            createStudent: jest.fn(),
            find: jest.fn(),
            findActiveStudents: jest.fn(),
            findOne: jest.fn(),
            findByEmail: jest.fn(),
            findByCpf: jest.fn(),
            updateStudent: jest.fn(),
            deleteStudent: jest.fn(),
            hardDeleteStudent: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Enrollment),
          useValue: {
            count: jest.fn().mockResolvedValue(0),
          },
        },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    repository = module.get<jest.Mocked<StudentsRepository>>(StudentsRepository);
  });

  describe('create', () => {
    it('should create a student', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678901',
        phone: '11999999999',
      };

      repository.findByEmail.mockResolvedValueOnce(null);
      repository.findByCpf.mockResolvedValueOnce(null);
      repository.createStudent.mockResolvedValueOnce(mockStudent);

      const result = await service.create(createStudentDto);

      expect(result).toEqual(mockStudent);
      expect(repository.createStudent).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678901',
        phone: '11999999999',
        status: 'active',
      });
    });

    it('should throw BadRequestException if email already exists', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'João Silva',
        email: 'joao@example.com',
        cpf: '12345678901',
      };

      repository.findByEmail.mockResolvedValueOnce(mockStudent);

      await expect(service.create(createStudentDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.createStudent).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if CPF already exists', async () => {
      const createStudentDto: CreateStudentDto = {
        name: 'João Silva',
        email: 'novo@example.com',
        cpf: '12345678901',
      };

      repository.findByEmail.mockResolvedValueOnce(null);
      repository.findByCpf.mockResolvedValueOnce(mockStudent);

      await expect(service.create(createStudentDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all students', async () => {
      repository.find.mockResolvedValueOnce([mockStudent]);

      const result = await service.findAll();

      expect(result).toEqual([mockStudent]);
    });
  });

  describe('findActive', () => {
    it('should return only active students', async () => {
      repository.findActiveStudents.mockResolvedValueOnce([mockStudent]);

      const result = await service.findActive();

      expect(result).toEqual([mockStudent]);
    });
  });

  describe('findOne', () => {
    it('should return a student by id', async () => {
      repository.findOne.mockResolvedValueOnce(mockStudent);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174001');

      expect(result).toEqual(mockStudent);
    });

    it('should throw NotFoundException if student not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.findOne('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updateDto = { name: 'João Updated' };

      repository.findOne.mockResolvedValueOnce(mockStudent);
      repository.findByEmail.mockResolvedValueOnce(null);
      repository.findByCpf.mockResolvedValueOnce(null);
      repository.updateStudent.mockResolvedValueOnce({
        ...mockStudent,
        name: 'João Updated',
      });

      const result = await service.update('123e4567-e89b-12d3-a456-426614174001', updateDto);

      expect(result.name).toBe('João Updated');
    });

    it('should throw NotFoundException if student not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.update('non-existent-id', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if email is already in use by another student', async () => {
      const otherStudent = { ...mockStudent, id: 'other-id' };
      const updateDto = { email: 'other@example.com' };

      repository.findOne.mockResolvedValueOnce(mockStudent);
      repository.findByEmail.mockResolvedValueOnce(otherStudent);

      await expect(
        service.update('123e4567-e89b-12d3-a456-426614174001', updateDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should soft delete a student', async () => {
      repository.findOne.mockResolvedValueOnce(mockStudent);
      repository.deleteStudent.mockResolvedValueOnce(undefined);

      await service.remove('123e4567-e89b-12d3-a456-426614174001');

      expect(repository.deleteStudent).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174001');
    });
  });
});
