import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

// Não há constraint UNIQUE incondicional em (student, course): a regra de negócio
// permite reinscrever um aluno no mesmo curso após cancelamento. A duplicidade
// de matrícula ATIVA é validada em EnrollmentsService.create.
@Entity('enrollments')
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

  // Tipado como string ("YYYY-MM-DD"), não Date: TypeORM serializa colunas
  // `date` usando os métodos LOCAIS do objeto Date (getFullYear/getMonth/getDate,
  // não a versão UTC), o que desloca o dia em um timezone negativo. Passar a
  // string direto evita qualquer conversão de timezone.
  @Column({ type: 'date', nullable: true })
  startDate: string | null;

  @Column({ type: 'date', nullable: true })
  endDate: string | null;

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
