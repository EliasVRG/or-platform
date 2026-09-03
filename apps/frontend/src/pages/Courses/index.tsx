import { useState } from 'react';
import { useCourses } from '../../hooks/useCourses';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Badge } from '../../components/ui/Badge';
import { CourseForm } from './CourseForm';
import type { CourseFormData } from '../../schemas/course.schema';
import type { Course } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function Courses() {
  const { courses, createCourse, updateCourse, removeCourse, loading, error } = useCourses();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  const handleOpenDialog = (course?: Course) => {
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleSubmit = async (data: CourseFormData) => {
    setFormLoading(true);
    try {
      if (selectedCourse) {
        await updateCourse(selectedCourse.id, data);
      } else {
        await createCourse(data);
      }
      setOpenDialog(false);
      setSelectedCourse(undefined);
    } catch (err) {
      console.error('Erro ao salvar curso:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este curso?')) {
      try {
        await removeCourse(id);
      } catch (err) {
        console.error('Erro ao deletar curso:', err);
      }
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <div>
      <Header
        title="Cursos"
        subtitle="Gerenciar cursos disponíveis"
        action={
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Novo Curso
          </Button>
        }
      />

      <div className="p-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar curso..."
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Horas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Preço</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{course.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{course.hours}h</td>
                  <td className="px-6 py-4 text-sm text-gray-600">R$ {course.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <Badge status={course.status} />
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button
                      onClick={() => handleOpenDialog(course)}
                      className="text-brand-600 hover:text-brand-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
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
        title={selectedCourse ? 'Editar Curso' : 'Novo Curso'}
      >
        <CourseForm
          course={selectedCourse}
          onSubmit={handleSubmit}
          isLoading={formLoading}
        />
      </Dialog>
    </div>
  );
}
