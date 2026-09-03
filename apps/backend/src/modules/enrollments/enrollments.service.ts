import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EnrollmentsRepository } from './enrollments.repository';
import { StudentsRepository } from '../students/students.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    private enrollmentsRepository: EnrollmentsRepository,
    private studentsRepository: StudentsRepository,
    private coursesRepository: CoursesRepository,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
    const student = await this.studentsRepository.findOne({
      where: { id: createEnrollmentDto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.status === 'inactive') {
      throw new BadRequestException(
        'Cannot enroll an inactive student',
      );
    }

    const course = await this.coursesRepository.findOne({
      where: { id: createEnrollmentDto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status === 'inactive') {
      throw new BadRequestException('Cannot enroll in an inactive course');
    }

    const existingEnrollment =
      await this.enrollmentsRepository.findActiveEnrollmentByStudentAndCourse(
        createEnrollmentDto.studentId,
        createEnrollmentDto.courseId,
      );

    if (existingEnrollment) {
      throw new BadRequestException(
        'Student is already enrolled in this course',
      );
    }

    return this.enrollmentsRepository.createEnrollment({
      studentId: createEnrollmentDto.studentId,
      courseId: createEnrollmentDto.courseId,
      status: createEnrollmentDto.status || 'pending',
      startDate: createEnrollmentDto.startDate
        ? new Date(createEnrollmentDto.startDate)
        : undefined,
      endDate: createEnrollmentDto.endDate
        ? new Date(createEnrollmentDto.endDate)
        : undefined,
    });
  }

  async findAll(): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      relations: ['student', 'course'],
    });
  }

  async findActive(): Promise<Enrollment[]> {
    return this.enrollmentsRepository.findActiveEnrollments();
  }

  async findOne(id: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id },
      relations: ['student', 'course'],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    const student = await this.studentsRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return this.enrollmentsRepository.findStudentEnrollments(studentId);
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return this.enrollmentsRepository.findCourseEnrollments(courseId);
  }

  async update(
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    const enrollment = await this.findOne(id);

    if (updateEnrollmentDto.studentId && updateEnrollmentDto.studentId !== enrollment.studentId) {
      const student = await this.studentsRepository.findOne({
        where: { id: updateEnrollmentDto.studentId },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      if (student.status === 'inactive') {
        throw new BadRequestException('Cannot assign an inactive student');
      }
    }

    if (updateEnrollmentDto.courseId && updateEnrollmentDto.courseId !== enrollment.courseId) {
      const course = await this.coursesRepository.findOne({
        where: { id: updateEnrollmentDto.courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      if (course.status === 'inactive') {
        throw new BadRequestException('Cannot assign an inactive course');
      }
    }

    const data: Partial<Enrollment> = {};

    if (updateEnrollmentDto.studentId) {
      data.studentId = updateEnrollmentDto.studentId;
    }

    if (updateEnrollmentDto.courseId) {
      data.courseId = updateEnrollmentDto.courseId;
    }

    if (updateEnrollmentDto.status) {
      data.status = updateEnrollmentDto.status;
    }

    if (updateEnrollmentDto.startDate) {
      data.startDate = new Date(updateEnrollmentDto.startDate);
    }

    if (updateEnrollmentDto.endDate) {
      data.endDate = new Date(updateEnrollmentDto.endDate);
    }

    return this.enrollmentsRepository.updateEnrollment(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.enrollmentsRepository.deleteEnrollment(id);
  }

  async hardRemove(id: string): Promise<void> {
    const enrollment = await this.findOne(id);
    if (!['canceled', 'completed'].includes(enrollment.status)) {
      throw new Error('Only canceled or completed enrollments can be permanently deleted');
    }
    await this.enrollmentsRepository.hardDeleteEnrollment(id);
  }
}
