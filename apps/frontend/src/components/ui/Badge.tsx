import type { CourseStatus, StudentStatus, EnrollmentStatus } from '../../types';

interface BadgeProps {
  status: CourseStatus | StudentStatus | EnrollmentStatus;
}

const statusStyles = {
  active: 'bg-success-100 text-success-700 border border-success-300',
  inactive: 'bg-neutral-100 text-neutral-700 border border-neutral-300',
  pending: 'bg-warning-100 text-warning-700 border border-warning-300',
  canceled: 'bg-danger-100 text-danger-700 border border-danger-300',
  completed: 'bg-brand-100 text-brand-700 border border-brand-300',
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
    <span className={`inline-flex items-center px-md py-xs rounded-md text-xs font-semibold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
