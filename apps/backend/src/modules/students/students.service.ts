import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StudentsRepository } from './students.repository';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(private studentsRepository: StudentsRepository) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const existingEmail = await this.studentsRepository.findByEmail(
      createStudentDto.email,
    );
    if (existingEmail) {
      throw new BadRequestException('Email already registered');
    }

    const existingCpf = await this.studentsRepository.findByCpf(
      createStudentDto.cpf,
    );
    if (existingCpf) {
      throw new BadRequestException('CPF already registered');
    }

    return this.studentsRepository.createStudent({
      name: createStudentDto.name,
      email: createStudentDto.email,
      cpf: createStudentDto.cpf,
      phone: createStudentDto.phone,
      status: createStudentDto.status || 'active',
    });
  }

  async findAll(): Promise<Student[]> {
    return this.studentsRepository.find();
  }

  async findActive(): Promise<Student[]> {
    return this.studentsRepository.findActiveStudents();
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentsRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    await this.findOne(id);

    if (updateStudentDto.email) {
      const existingEmail = await this.studentsRepository.findByEmail(
        updateStudentDto.email,
      );
      if (existingEmail && existingEmail.id !== id) {
        throw new BadRequestException('Email already registered');
      }
    }

    if (updateStudentDto.cpf) {
      const existingCpf = await this.studentsRepository.findByCpf(
        updateStudentDto.cpf,
      );
      if (existingCpf && existingCpf.id !== id) {
        throw new BadRequestException('CPF already registered');
      }
    }

    return this.studentsRepository.updateStudent(id, updateStudentDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.studentsRepository.deleteStudent(id);
  }

  async hardRemove(id: string): Promise<void> {
    const student = await this.findOne(id);
    if (student.status !== 'inactive') {
      throw new Error('Only inactive students can be permanently deleted');
    }
    await this.studentsRepository.hardDeleteStudent(id);
  }
}
