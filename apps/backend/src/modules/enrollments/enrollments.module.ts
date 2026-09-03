import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsRepository } from './enrollments.repository';
import { Enrollment } from './entities/enrollment.entity';
import { StudentsModule } from '../students/students.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]),
    StudentsModule,
    CoursesModule,
  ],
  providers: [EnrollmentsService, EnrollmentsRepository],
  controllers: [EnrollmentsController],
  exports: [EnrollmentsRepository],
})
export class EnrollmentsModule {}
