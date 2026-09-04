import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesRepository } from './courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class CoursesService {
  constructor(
    private coursesRepository: CoursesRepository,
    @InjectRepository(Enrollment)
    private enrollmentsRepository: Repository<Enrollment>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesRepository.createCourse({
      name: createCourseDto.name,
      description: createCourseDto.description,
      hours: createCourseDto.hours,
      price: createCourseDto.price,
      status: createCourseDto.status || 'active',
    });
  }

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find();
  }

  async findActive(): Promise<Course[]> {
    return this.coursesRepository.findActiveCourses();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    await this.findOne(id);
    return this.coursesRepository.updateCourse(id, updateCourseDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.coursesRepository.deleteCourse(id);
  }

  async hardRemove(id: string): Promise<void> {
    const course = await this.findOne(id);
    if (course.status !== 'inactive') {
      throw new BadRequestException(
        'Only inactive courses can be permanently deleted',
      );
    }

    const dependentEnrollments = await this.enrollmentsRepository.count({
      where: { courseId: id },
    });
    if (dependentEnrollments > 0) {
      throw new ConflictException(
        `Não é possível excluir permanentemente: existem ${dependentEnrollments} matrícula(s) vinculada(s) a este curso. Remova ou cancele as matrículas primeiro.`,
      );
    }

    await this.coursesRepository.hardDeleteCourse(id);
  }
}
