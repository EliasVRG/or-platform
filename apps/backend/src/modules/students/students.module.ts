import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './students.repository';
import { Student } from './entities/student.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Enrollment])],
  providers: [StudentsService, StudentsRepository],
  controllers: [StudentsController],
  exports: [StudentsRepository],
})
export class StudentsModule {}
