import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsRepository extends Repository<Enrollment> {
  constructor(dataSource: DataSource) {
    super(Enrollment, dataSource.createEntityManager());
  }

  async findByIdOrThrow(id: string): Promise<Enrollment> {
    const enrollment = await this.findOne({
      where: { id },
      relations: ['student', 'course'],
    });
    if (!enrollment) {
      throw new Error(`Enrollment with ID ${id} not found`);
    }
    return enrollment;
  }

  async findActiveEnrollmentByStudentAndCourse(
    studentId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    return this.findOne({
      where: {
        studentId,
        courseId,
        status: 'active',
      },
    });
  }

  async findStudentEnrollments(studentId: string): Promise<Enrollment[]> {
    return this.find({
      where: { studentId },
      relations: ['course'],
    });
  }

  async findCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    return this.find({
      where: { courseId },
      relations: ['student'],
    });
  }

  async findActiveEnrollments(): Promise<Enrollment[]> {
    return this.find({
      where: { status: 'active' },
      relations: ['student', 'course'],
    });
  }

  async createEnrollment(data: Partial<Enrollment>): Promise<Enrollment> {
    const enrollment = this.create(data);
    return this.save(enrollment);
  }

  async updateEnrollment(
    id: string,
    data: Partial<Enrollment>,
  ): Promise<Enrollment> {
    await this.update(id, data);
    return this.findByIdOrThrow(id);
  }

  async deleteEnrollment(id: string): Promise<void> {
    await this.update(id, { status: 'canceled' });
  }

  async hardDeleteEnrollment(id: string): Promise<void> {
    await this.delete(id);
  }
}
