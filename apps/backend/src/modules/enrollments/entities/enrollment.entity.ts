import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('enrollments')
@Unique(['student', 'course'])
@Index(['student'])
@Index(['course'])
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: 'pending' | 'active' | 'canceled' | 'completed';

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Course, (course) => course.enrollments, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
