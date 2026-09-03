import { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Badge } from '../../components/ui/Badge';
import { StudentForm } from './StudentForm';
import type { StudentFormData } from '../../schemas/student.schema';
import type { Student } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function Students() {
  const { students, createStudent, updateStudent, removeStudent, loading, error } = useStudents();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const handleOpenDialog = (student?: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: StudentFormData) => {
    setFormLoading(true);
    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.id, data);
      } else {
        await createStudent(data);
      }
      setOpenDialog(false);
      setSelectedStudent(undefined);
    } catch (err) {
      console.error('Erro ao salvar aluno:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este aluno?')) {
      try {
        await removeStudent(id);
      } catch (err) {
        console.error('Erro ao deletar aluno:', err);
      }
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div>
      <Header
        title="Alunos"
        subtitle="Gerenciar alunos"
        action={
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Novo Aluno
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>

        {error && <div className="p-4 bg-danger-50 text-danger-600 rounded-lg">{error}</div>}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">CPF</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.cpf}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge status={student.status} />
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleOpenDialog(student)}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
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
        title={selectedStudent ? 'Editar Aluno' : 'Novo Aluno'}
      >
        <StudentForm
          student={selectedStudent}
          onSubmit={handleSubmit}
          isLoading={formLoading}
        />
      </Dialog>
    </div>
  );
}
