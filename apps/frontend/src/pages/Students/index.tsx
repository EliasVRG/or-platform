import { useState } from 'react';
import { useStudents } from '../../hooks/useStudents';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Badge } from '../../components/ui/Badge';
import { StudentForm } from './StudentForm';
import type { StudentFormData } from '../../schemas/student.schema';
import type { Student } from '../../types';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export function Students() {
  const { students, createStudent, updateStudent, removeStudent, hardRemoveStudent, loading, error } = useStudents();
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

  const handleHardDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar permanentemente este aluno? Esta ação não pode ser desfeita.')) {
      try {
        await hardRemoveStudent(id);
      } catch (err) {
        console.error('Erro ao deletar permanentemente aluno:', err);
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

  if (loading) return <div className="p-2xl">Carregando...</div>;

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Alunos"
        subtitle="Gerenciar alunos matriculados no sistema"
        action={
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Novo Aluno
          </Button>
        }
      />

      <div className="flex-1 overflow-auto px-2xl py-2xl">
        <div className="space-y-lg">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-lg">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-md top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-lg pr-md py-md border border-neutral-300 rounded-md focus:ring-2 focus:ring-brand-600 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-md py-md border border-neutral-300 rounded-md focus:ring-2 focus:ring-brand-600 focus:border-transparent text-sm"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
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
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Nome</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Email</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">CPF</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Telefone</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Status</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-lg py-md text-sm font-medium text-neutral-900">{student.name}</td>
                      <td className="px-lg py-md text-sm text-neutral-600">{student.email}</td>
                      <td className="px-lg py-md text-sm text-neutral-600 font-mono">{student.cpf}</td>
                      <td className="px-lg py-md text-sm text-neutral-600">{student.phone}</td>
                      <td className="px-lg py-md text-sm">
                        <Badge status={student.status} />
                      </td>
                      <td className="px-lg py-md text-sm">
                        <div className="flex gap-md">
                          <button
                            onClick={() => handleOpenDialog(student)}
                            className="text-brand-600 hover:text-brand-700 transition-colors p-md"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          {student.status === 'active' ? (
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="text-danger-600 hover:text-danger-700 transition-colors p-md"
                              title="Marcar como inativo"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleHardDelete(student.id)}
                              className="text-red-700 hover:text-red-900 font-bold transition-colors p-md"
                              title="Deletar permanentemente"
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
                      Nenhum aluno encontrado
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
