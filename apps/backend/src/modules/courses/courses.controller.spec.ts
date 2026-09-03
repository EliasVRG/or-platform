import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: jest.Mocked<CoursesService>;

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
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findActive: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get<jest.Mocked<CoursesService>>(CoursesService);
  });

  describe('POST /courses', () => {
    it('should create a course', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Node.js Basics',
        description: 'Learn Node.js',
        hours: 40,
        price: 499.99,
      };

      service.create.mockResolvedValueOnce(mockCourse);

      const result = await controller.create(createCourseDto);

      expect(result).toEqual(mockCourse);
      expect(service.create).toHaveBeenCalledWith(createCourseDto);
    });
  });

  describe('GET /courses', () => {
    it('should return all courses', async () => {
      service.findAll.mockResolvedValueOnce([mockCourse]);

      const result = await controller.findAll();

      expect(result).toEqual([mockCourse]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /courses/active', () => {
    it('should return active courses', async () => {
      service.findActive.mockResolvedValueOnce([mockCourse]);

      const result = await controller.findActive();

      expect(result).toEqual([mockCourse]);
      expect(service.findActive).toHaveBeenCalled();
    });
  });

  describe('GET /courses/:id', () => {
    it('should return a course by id', async () => {
      service.findOne.mockResolvedValueOnce(mockCourse);

      const result = await controller.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockCourse);
      expect(service.findOne).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });

  describe('PATCH /courses/:id', () => {
    it('should update a course', async () => {
      const updateCourseDto = { name: 'Updated Course' };
      service.update.mockResolvedValueOnce({
        ...mockCourse,
        name: 'Updated Course',
      });

      const result = await controller.update('123e4567-e89b-12d3-a456-426614174000', updateCourseDto);

      expect(result.name).toBe('Updated Course');
      expect(service.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', updateCourseDto);
    });
  });

  describe('DELETE /courses/:id', () => {
    it('should delete a course', async () => {
      service.remove.mockResolvedValueOnce(undefined);

      await controller.remove('123e4567-e89b-12d3-a456-426614174000');

      expect(service.remove).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });
  });
});
