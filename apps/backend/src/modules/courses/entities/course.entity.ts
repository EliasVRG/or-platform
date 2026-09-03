import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer' })
  hours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: { to: (val) => val, from: (val) => parseFloat(val) } })
  price: number;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: 'active' | 'inactive';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
