import { useState } from 'react';
import { useEnrollments } from '../../hooks/useEnrollments';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Badge } from '../../components/ui/Badge';
import { EnrollmentForm } from './EnrollmentForm';
import type { EnrollmentFormData } from '../../schemas/enrollment.schema';
import type { Enrollment } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function Enrollments() {
  const { enrollments, createEnrollment, updateEnrollment, removeEnrollment, loading, error } = useEnrollments();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'active' | 'canceled' | 'completed'>('all');

  const handleOpenDialog = (enrollment?: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: EnrollmentFormData) => {
    setFormLoading(true);
    try {
      if (selectedEnrollment) {
        await updateEnrollment(selectedEnrollment.id, data);
      } else {
        await createEnrollment(data);
      }
      setOpenDialog(false);
      setSelectedEnrollment(undefined);
    } catch (err) {
      console.error('Erro ao salvar matrícula:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja cancelar esta matrícula?')) {
      try {
        await removeEnrollment(id);
      } catch (err) {
        console.error('Erro ao cancelar matrícula:', err);
      }
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    const studentName = enrollment.student?.name.toLowerCase() ?? '';
    const courseName = enrollment.course?.name.toLowerCase() ?? '';
    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) || courseName.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div>
      <Header
        title="Matrículas"
        subtitle="Gerenciar matrículas de alunos"
        action={
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Nova Matrícula
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por aluno ou curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="active">Ativo</option>
            <option value="canceled">Cancelado</option>
            <option value="completed">Concluído</option>
          </select>
        </div>

        {error && <div className="p-4 bg-danger-50 text-danger-600 rounded-lg">{error}</div>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aluno</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Curso</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {enrollment.student?.name ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {enrollment.course?.name ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Badge status={enrollment.status} />
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleOpenDialog(enrollment)}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(enrollment.id)}
                      className="text-danger-600 hover:text-danger-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={selectedEnrollment ? 'Editar Matrícula' : 'Nova Matrícula'}
      >
        <EnrollmentForm
          enrollment={selectedEnrollment}
          onSubmit={handleSubmit}
          isLoading={formLoading}
        />
      </Dialog>
    </div>
  );
}
