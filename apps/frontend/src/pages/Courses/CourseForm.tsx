import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, type CourseFormData } from '../../schemas/course.schema';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { Course } from '../../types';
import { useEffect } from 'react';

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CourseFormData) => Promise<void>;
  isLoading?: boolean;
}

const getError = (error: any): string | undefined =>
  typeof error?.message === 'string' ? error.message : undefined;

export function CourseForm({ course, onSubmit, isLoading = false }: CourseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: course ? {
      name: course.name,
      description: course.description || '',
      hours: course.hours,
      price: course.price,
      status: course.status,
    } : undefined,
  } as any);

  const statusValue = watch('status');

  // Atualizar valores quando course mudar
  useEffect(() => {
    if (course) {
      setValue('name', course.name);
      setValue('description', course.description || '');
      setValue('hours', course.hours);
      setValue('price', course.price);
      setValue('status', course.status);
    }
  }, [course, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <Input
        label="Nome do Curso"
        placeholder="Ex: Node.js Avançado"
        {...register('name')}
        error={getError(errors.name)}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-900">Descrição</label>
        <textarea
          placeholder="Descrição do curso"
          {...register('description')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {getError(errors.description) && (
          <span className="text-sm text-danger-600">{getError(errors.description)}</span>
        )}
      </div>

      <Input
        label="Carga Horária"
        type="number"
        placeholder="40"
        {...register('hours', { valueAsNumber: true })}
        error={getError(errors.hours)}
      />

      <Input
        label="Preço"
        type="number"
        step="0.01"
        placeholder="499.99"
        {...register('price', { valueAsNumber: true })}
        error={getError(errors.price)}
      />

      <Select
        label="Status"
        value={statusValue}
        {...register('status')}
        options={[
          { value: 'active', label: 'Ativo' },
          { value: 'inactive', label: 'Inativo' },
        ]}
        error={getError(errors.status)}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : course ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}
