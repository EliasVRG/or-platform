import { useState } from 'react';
import { useEnrollments } from '../../hooks/useEnrollments';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';
import { EnrollmentForm } from './EnrollmentForm';
import { formatDate } from '../../utils/date';
import type { EnrollmentFormData } from '../../schemas/enrollment.schema';
import type { Enrollment } from '../../types';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export function Enrollments() {
  const { enrollments, createEnrollment, updateEnrollment, removeEnrollment, hardRemoveEnrollment, loading, error } = useEnrollments();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'canceled' | 'completed'>('all');
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; mode: 'soft' | 'hard' } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOpenDialog = (enrollment?: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: EnrollmentFormData) => {
    setFormLoading(true);
    setActionError(null);
    try {
      if (selectedEnrollment) {
        await updateEnrollment(selectedEnrollment.id, data);
      } else {
        await createEnrollment(data);
      }
      setOpenDialog(false);
      setSelectedEnrollment(undefined);
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    setConfirmLoading(true);
    setActionError(null);
    try {
      if (confirmTarget.mode === 'hard') {
        await hardRemoveEnrollment(confirmTarget.id);
      } else {
        await removeEnrollment(confirmTarget.id);
      }
      setConfirmTarget(null);
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setConfirmLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName = enrollment.student?.name.toLowerCase() ?? '';
    const courseName = enrollment.course?.name.toLowerCase() ?? '';
    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) || courseName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-2xl">Carregando...</div>;

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Matrículas"
        subtitle="Gerenciar matrículas de alunos nos cursos"
        action={
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Nova Matrícula
          </Button>
        }
      />

      <div className="flex-1 overflow-auto px-2xl py-2xl">
        <div className="space-y-lg">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-lg">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-lg top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por aluno ou curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3xl pr-md py-md border border-neutral-300 rounded-md focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-md py-md border border-neutral-300 rounded-md focus:ring-2 focus:ring-brand-600 focus:border-transparent text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="active">Ativo</option>
              <option value="completed">Concluído</option>
              <option value="canceled">Cancelado</option>
            </select>
          </div>

          {error && (
            <div className="p-lg bg-danger-50 text-danger-700 rounded-md border border-danger-200">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="surface overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Aluno</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Curso</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Início</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Término</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Status</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-lg py-md text-sm font-medium text-neutral-900">
                        {enrollment.student?.name ?? 'N/A'}
                      </td>
                      <td className="px-lg py-md text-sm text-neutral-600">
                        {enrollment.course?.name ?? 'N/A'}
                      </td>
                      <td className="px-lg py-md text-sm text-neutral-600">
                        {formatDate(enrollment.startDate)}
                      </td>
                      <td className="px-lg py-md text-sm text-neutral-600">
                        {formatDate(enrollment.endDate)}
                      </td>
                      <td className="px-lg py-md text-sm">
                        <Badge status={enrollment.status} />
                      </td>
                      <td className="px-lg py-md text-sm">
                        <div className="flex gap-md">
                          <button
                            onClick={() => handleOpenDialog(enrollment)}
                            className="text-brand-600 hover:text-brand-700 transition-colors p-md"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          {['canceled', 'completed'].includes(enrollment.status) ? (
                            <button
                              onClick={() => setConfirmTarget({ id: enrollment.id, mode: 'hard' })}
                              className="text-red-700 hover:text-red-900 font-bold transition-colors p-md"
                              title="Deletar permanentemente"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmTarget({ id: enrollment.id, mode: 'soft' })}
                              className="text-danger-600 hover:text-danger-700 transition-colors p-md"
                              title="Cancelar"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-lg py-2xl text-center text-neutral-500">
                      Nenhuma matrícula encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog
        open={openDialog}
        onOpenChange={(open) => { setOpenDialog(open); if (!open) setActionError(null); }}
        title={selectedEnrollment ? 'Editar Matrícula' : 'Nova Matrícula'}
      >
        {actionError && (
          <div className="mb-lg p-lg bg-danger-50 text-danger-700 rounded-md border border-danger-200 text-sm">
            {actionError}
          </div>
        )}
        <EnrollmentForm
          enrollment={selectedEnrollment}
          onSubmit={handleSubmit}
          isLoading={formLoading}
        />
      </Dialog>

      <ConfirmDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) { setConfirmTarget(null); setActionError(null); } }}
        onConfirm={handleConfirmDelete}
        loading={confirmLoading}
        error={actionError}
        variant={confirmTarget?.mode === 'hard' ? 'danger' : 'warning'}
        title={confirmTarget?.mode === 'hard' ? 'Excluir permanentemente' : 'Cancelar matrícula'}
        description={
          confirmTarget?.mode === 'hard'
            ? 'Esta matrícula será excluída permanentemente do banco de dados. Esta ação não pode ser desfeita.'
            : 'A matrícula será marcada como cancelada. Você pode reverter isso editando a matrícula depois.'
        }
        confirmLabel={confirmTarget?.mode === 'hard' ? 'Excluir permanentemente' : 'Cancelar matrícula'}
      />
    </div>
  );
}
