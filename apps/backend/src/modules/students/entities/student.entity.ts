import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity('students')
@Index(['email'], { unique: true })
@Index(['cpf'], { unique: true })
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 11 })
  cpf: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: 'active' | 'inactive';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
