import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enrollmentSchema, type EnrollmentFormData } from '../../schemas/enrollment.schema';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { SearchSelect } from '../../components/ui/SearchSelect';
import { Button } from '../../components/ui/Button';
import type { Enrollment } from '../../types';
import { useStudents } from '../../hooks/useStudents';
import { useCourses } from '../../hooks/useCourses';
import { useEffect } from 'react';

interface EnrollmentFormProps {
  enrollment?: Enrollment;
  onSubmit: (data: EnrollmentFormData) => Promise<void>;
  isLoading?: boolean;
}

const getError = (error: any): string | undefined =>
  typeof error?.message === 'string' ? error.message : undefined;

export function EnrollmentForm({ enrollment, onSubmit, isLoading = false }: EnrollmentFormProps) {
  const { students } = useStudents();
  const { courses } = useCourses();
  const activeCourses = courses.filter(c => c.status === 'active');
  const activeStudents = students.filter(s => s.status === 'active');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: enrollment ? {
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      status: enrollment.status,
      startDate: enrollment.startDate || '',
      endDate: enrollment.endDate || '',
    } : undefined,
  } as any);

  const studentIdValue = watch('studentId');
  const courseIdValue = watch('courseId');
  const statusValue = watch('status');

  // Atualizar valores quando enrollment mudar
  useEffect(() => {
    if (enrollment) {
      setValue('studentId', enrollment.studentId);
      setValue('courseId', enrollment.courseId);
      setValue('status', enrollment.status);
      setValue('startDate', enrollment.startDate || '');
      setValue('endDate', enrollment.endDate || '');
    }
  }, [enrollment, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <SearchSelect
        label="Aluno"
        value={studentIdValue}
        onChange={(value) => setValue('studentId', value)}
        options={activeStudents.map((s) => ({ value: s.id, label: s.name }))}
        error={getError(errors.studentId)}
      />

      <SearchSelect
        label="Curso"
        value={courseIdValue}
        onChange={(value) => setValue('courseId', value)}
        options={activeCourses.map((c) => ({ value: c.id, label: c.name }))}
        error={getError(errors.courseId)}
      />

      <Select
        label="Status"
        value={statusValue}
        {...register('status')}
        options={[
          { value: 'pending', label: 'Pendente' },
          { value: 'active', label: 'Ativo' },
          { value: 'canceled', label: 'Cancelado' },
          { value: 'completed', label: 'Concluído' },
        ]}
        error={getError(errors.status)}
      />

      <Input
        label="Data de Início"
        type="date"
        {...register('startDate')}
        error={getError(errors.startDate)}
      />

      <Input
        label="Data de Término"
        type="date"
        {...register('endDate')}
        error={getError(errors.endDate)}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : enrollment ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}
