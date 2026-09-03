import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsRepository extends Repository<Student> {
  constructor(dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  async findByIdOrThrow(id: string): Promise<Student> {
    const student = await this.findOne({ where: { id } });
    if (!student) {
      throw new Error(`Student with ID ${id} not found`);
    }
    return student;
  }

  async findByEmailOrThrow(email: string): Promise<Student> {
    const student = await this.findOne({ where: { email } });
    if (!student) {
      throw new Error(`Student with email ${email} not found`);
    }
    return student;
  }

  async findByEmail(email: string): Promise<Student | null> {
    return this.findOne({ where: { email } });
  }

  async findByCpf(cpf: string): Promise<Student | null> {
    return this.findOne({ where: { cpf } });
  }

  async findActiveStudents(): Promise<Student[]> {
    return this.find({ where: { status: 'active' } });
  }

  async createStudent(data: Partial<Student>): Promise<Student> {
    const student = this.create(data);
    return this.save(student);
  }

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    await this.update(id, data);
    return this.findByIdOrThrow(id);
  }

  async deleteStudent(id: string): Promise<void> {
    await this.update(id, { status: 'inactive' });
  }

  async hardDeleteStudent(id: string): Promise<void> {
    await this.delete(id);
  }
}
