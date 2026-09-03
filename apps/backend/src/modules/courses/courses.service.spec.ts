import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

describe('CoursesService', () => {
  let service: CoursesService;
  let repository: jest.Mocked<CoursesRepository>;

  const mockCourse = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Node.js Basics',
    description: 'Learn Node.js',
    hours: 40,
    price: 499.99,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollments: [] as any[],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: CoursesRepository,
          useValue: {
            createCourse: jest.fn(),
            find: jest.fn(),
            findActiveCourses: jest.fn(),
            findOne: jest.fn(),
            updateCourse: jest.fn(),
            deleteCourse: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    repository = module.get<jest.Mocked<CoursesRepository>>(CoursesRepository);
  });

  describe('create', () => {
    it('should create a course', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Node.js Basics',
        description: 'Learn Node.js',
        hours: 40,
        price: 499.99,
      };

      repository.createCourse.mockResolvedValueOnce(mockCourse);

      const result = await service.create(createCourseDto);

      expect(result).toEqual(mockCourse);
      expect(repository.createCourse).toHaveBeenCalledWith({
        name: 'Node.js Basics',
        description: 'Learn Node.js',
        hours: 40,
        price: 499.99,
        status: 'active',
      });
    });

    it('should set default status to active', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Python',
        hours: 50,
        price: 299.99,
      };

      repository.createCourse.mockResolvedValueOnce(mockCourse);

      await service.create(createCourseDto);

      expect(repository.createCourse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'active' }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      repository.find.mockResolvedValueOnce([mockCourse]);

      const result = await service.findAll();

      expect(result).toEqual([mockCourse]);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return empty array if no courses', async () => {
      repository.find.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findActive', () => {
    it('should return only active courses', async () => {
      repository.findActiveCourses.mockResolvedValueOnce([mockCourse]);

      const result = await service.findActive();

      expect(result).toEqual([mockCourse]);
      expect(repository.findActiveCourses).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      repository.findOne.mockResolvedValueOnce(mockCourse);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockCourse);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('should throw NotFoundException if course not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.findOne('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateCourseDto: UpdateCourseDto = {
        name: 'Updated Course',
      };

      repository.findOne.mockResolvedValueOnce(mockCourse);
      repository.updateCourse.mockResolvedValueOnce({
        ...mockCourse,
        name: 'Updated Course',
      });

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateCourseDto);

      expect(result.name).toBe('Updated Course');
      expect(repository.updateCourse).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        updateCourseDto,
      );
    });

    it('should throw NotFoundException if course not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.update('non-existent-id', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a course', async () => {
      repository.findOne.mockResolvedValueOnce(mockCourse);
      repository.deleteCourse.mockResolvedValueOnce(undefined);

      await service.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.deleteCourse).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw NotFoundException if course not found', async () => {
      repository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.remove('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
