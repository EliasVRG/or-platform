import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesRepository extends Repository<Course> {
  constructor(dataSource: DataSource) {
    super(Course, dataSource.createEntityManager());
  }

  async findByIdOrThrow(id: string): Promise<Course> {
    const course = await this.findOne({ where: { id } });
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return course;
  }

  async findActiveCourses(): Promise<Course[]> {
    return this.find({ where: { status: 'active' } });
  }

  async createCourse(data: Partial<Course>): Promise<Course> {
    const course = this.create(data);
    return this.save(course);
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    await this.update(id, data);
    return this.findByIdOrThrow(id);
  }

  async deleteCourse(id: string): Promise<void> {
    await this.update(id, { status: 'inactive' });
  }

  async hardDeleteCourse(id: string): Promise<void> {
    await this.delete(id);
  }
}
