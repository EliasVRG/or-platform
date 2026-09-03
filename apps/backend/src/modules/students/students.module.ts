import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentsRepository } from './students.repository';
import { Student } from './entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentsService, StudentsRepository],
  controllers: [StudentsController],
  exports: [StudentsRepository],
})
export class StudentsModule {}
