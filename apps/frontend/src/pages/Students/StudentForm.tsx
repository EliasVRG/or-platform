import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, type StudentFormData } from '../../schemas/student.schema';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import type { Student } from '../../types';

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: StudentFormData) => Promise<void>;
  isLoading?: boolean;
}

const getError = (error: any): string | undefined =>
  typeof error?.message === 'string' ? error.message : undefined;

export function StudentForm({ student, onSubmit, isLoading = false }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: student ? {
      name: student.name,
      email: student.email,
      cpf: student.cpf,
      phone: student.phone || '',
      status: student.status,
    } : undefined,
  } as any);

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <Input
        label="Nome"
        placeholder="Ex: João Silva"
        {...register('name')}
        error={getError(errors.name)}
      />

      <Input
        label="Email"
        type="email"
        placeholder="joao@example.com"
        {...register('email')}
        error={getError(errors.email)}
      />

      <Input
        label="CPF"
        placeholder="12345678901"
        {...register('cpf')}
        error={getError(errors.cpf)}
      />

      <Input
        label="Telefone"
        placeholder="(11) 99999-9999"
        {...register('phone')}
        error={getError(errors.phone)}
      />

      <Select
        label="Status"
        {...register('status')}
        options={[
          { value: 'active', label: 'Ativo' },
          { value: 'inactive', label: 'Inativo' },
        ]}
        error={getError(errors.status)}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : student ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
}
