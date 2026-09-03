import type { CourseStatus, StudentStatus, EnrollmentStatus } from '../../types';

interface BadgeProps {
  status: CourseStatus | StudentStatus | EnrollmentStatus;
}

const statusStyles = {
  active: 'bg-success-50 text-success-600',
  inactive: 'bg-gray-100 text-gray-600',
  pending: 'bg-warning-50 text-warning-600',
  canceled: 'bg-danger-50 text-danger-600',
  completed: 'bg-brand-50 text-brand-600',
};

const statusLabels = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
  canceled: 'Cancelado',
  completed: 'Concluído',
};

export function Badge({ status }: BadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
