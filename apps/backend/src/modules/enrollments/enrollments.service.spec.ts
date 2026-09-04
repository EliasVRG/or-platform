import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsRepository } from './enrollments.repository';
import { StudentsRepository } from '../students/students.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';

describe('EnrollmentsService', () => {
  let service: EnrollmentsService;
  let enrollmentsRepository: jest.Mocked<EnrollmentsRepository>;
  let studentsRepository: jest.Mocked<StudentsRepository>;
  let coursesRepository: jest.Mocked<CoursesRepository>;

  const mockStudent = {
    id: 'student-123',
    name: 'João Silva',
    email: 'joao@example.com',
    cpf: '12345678901',
    phone: '11999999999',
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollments: [] as any[],
  };

  const mockInactiveStudent = {
    ...mockStudent,
    status: 'inactive' as const,
  };

  const mockCourse = {
    id: 'course-123',
    name: 'Node.js',
    description: 'Learn Node.js',
    hours: 40,
    price: 499.99,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollments: [] as any[],
  };

  const mockInactiveCourse = {
    ...mockCourse,
    status: 'inactive' as const,
  };

  const mockEnrollment = {
    id: 'enrollment-123',
    studentId: 'student-123',
    courseId: 'course-123',
    status: 'active' as const,
    startDate: new Date(),
    endDate: null as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    student: mockStudent,
    course: mockCourse,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentsService,
        {
          provide: EnrollmentsRepository,
          useValue: {
            createEnrollment: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findActiveEnrollments: jest.fn(),
            findActiveEnrollmentByStudentAndCourse: jest.fn(),
            findStudentEnrollments: jest.fn(),
            findCourseEnrollments: jest.fn(),
            updateEnrollment: jest.fn(),
            deleteEnrollment: jest.fn(),
          },
        },
        {
          provide: StudentsRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: CoursesRepository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EnrollmentsService>(EnrollmentsService);
    enrollmentsRepository = module.get<jest.Mocked<EnrollmentsRepository>>(
      EnrollmentsRepository,
    );
    studentsRepository = module.get<jest.Mocked<StudentsRepository>>(
      StudentsRepository,
    );
    coursesRepository = module.get<jest.Mocked<CoursesRepository>>(
      CoursesRepository,
    );
  });

  describe('create', () => {
    it('should create an enrollment', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        studentId: 'student-123',
        courseId: 'course-123',
        status: 'active',
      };

      studentsRepository.findOne.mockResolvedValueOnce(mockStudent);
      coursesRepository.findOne.mockResolvedValueOnce(mockCourse);
      enrollmentsRepository.findActiveEnrollmentByStudentAndCourse.mockResolvedValueOnce(
        null,
      );
      enrollmentsRepository.createEnrollment.mockResolvedValueOnce(mockEnrollment);
      enrollmentsRepository.findOne.mockResolvedValueOnce(mockEnrollment);

      const result = await service.create(createEnrollmentDto);

      expect(result).toEqual(mockEnrollment);
      expect(enrollmentsRepository.createEnrollment).toHaveBeenCalled();
    });

    it('should throw NotFoundException if student not found', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        studentId: 'non-existent',
        courseId: 'course-123',
      };

      studentsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createEnrollmentDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if student is inactive', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        studentId: 'student-123',
        courseId: 'course-123',
      };

      studentsRepository.findOne.mockResolvedValueOnce(mockInactiveStudent);

      await expect(service.create(createEnrollmentDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if course not found', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        studentId: 'student-123',
        courseId: 'non-existent',
      };

      studentsRepository.findOne.mockResolvedValueOnce(mockStudent);
      coursesRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createEnrollmentDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if course is inactive', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        studentId: 'student-123',
        courseId: 'course-123',
      };

      studentsRepository.findOne.mockResolvedValueOnce(mockStudent);
      coursesRepository.findOne.mockResolvedValueOnce(mockInactiveCourse);

      await expect(service.create(createEnrollmentDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if student is already enrolled', async () => {
      const createEnrollmentDto: CreateEnrollmentDto = {
        studentId: 'student-123',
        courseId: 'course-123',
      };

      studentsRepository.findOne.mockResolvedValueOnce(mockStudent);
      coursesRepository.findOne.mockResolvedValueOnce(mockCourse);
      enrollmentsRepository.findActiveEnrollmentByStudentAndCourse.mockResolvedValueOnce(
        mockEnrollment,
      );

      await expect(service.create(createEnrollmentDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all enrollments', async () => {
      enrollmentsRepository.find.mockResolvedValueOnce([mockEnrollment]);

      const result = await service.findAll();

      expect(result).toEqual([mockEnrollment]);
    });
  });

  describe('findActive', () => {
    it('should return only active enrollments', async () => {
      enrollmentsRepository.findActiveEnrollments.mockResolvedValueOnce([
        mockEnrollment,
      ]);

      const result = await service.findActive();

      expect(result).toEqual([mockEnrollment]);
    });
  });

  describe('findOne', () => {
    it('should return an enrollment by id', async () => {
      enrollmentsRepository.findOne.mockResolvedValueOnce(mockEnrollment);

      const result = await service.findOne('enrollment-123');

      expect(result).toEqual(mockEnrollment);
    });

    it('should throw NotFoundException if enrollment not found', async () => {
      enrollmentsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByStudent', () => {
    it('should return enrollments for a student', async () => {
      studentsRepository.findOne.mockResolvedValueOnce(mockStudent);
      enrollmentsRepository.findStudentEnrollments.mockResolvedValueOnce([
        mockEnrollment,
      ]);

      const result = await service.findByStudent('student-123');

      expect(result).toEqual([mockEnrollment]);
    });

    it('should throw NotFoundException if student not found', async () => {
      studentsRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findByStudent('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCourse', () => {
    it('should return enrollments for a course', async () => {
      coursesRepository.findOne.mockResolvedValueOnce(mockCourse);
      enrollmentsRepository.findCourseEnrollments.mockResolvedValueOnce([
        mockEnrollment,
      ]);

      const result = await service.findByCourse('course-123');

      expect(result).toEqual([mockEnrollment]);
    });

    it('should throw NotFoundException if course not found', async () => {
      coursesRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findByCourse('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should cancel an enrollment', async () => {
      enrollmentsRepository.findOne.mockResolvedValueOnce(mockEnrollment);
      enrollmentsRepository.deleteEnrollment.mockResolvedValueOnce(undefined);

      await service.remove('enrollment-123');

      expect(enrollmentsRepository.deleteEnrollment).toHaveBeenCalledWith(
        'enrollment-123',
      );
    });
  });
});
