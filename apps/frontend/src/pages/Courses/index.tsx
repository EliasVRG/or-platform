import { useState } from 'react';
import { useCourses } from '../../hooks/useCourses';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Badge } from '../../components/ui/Badge';
import { CourseForm } from './CourseForm';
import type { CourseFormData } from '../../schemas/course.schema';
import type { Course } from '../../types';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export function Courses() {
  const { courses, createCourse, updateCourse, removeCourse, hardRemoveCourse, loading, error } = useCourses();
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

  const handleHardDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar permanentemente este curso? Esta ação não pode ser desfeita.')) {
      try {
        await hardRemoveCourse(id);
      } catch (err) {
        console.error('Erro ao deletar permanentemente curso:', err);
      }
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-2xl">Carregando...</div>;

  return (
    <div className="flex flex-col h-screen">
      <Header
        title="Cursos"
        subtitle="Gerenciar cursos disponíveis no sistema"
        action={
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Novo Curso
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
                placeholder="Buscar curso..."
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
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Carga Horária</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Preço</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Status</th>
                  <th className="px-lg py-md text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-lg py-md text-sm font-medium text-neutral-900">{course.name}</td>
                      <td className="px-lg py-md text-sm text-neutral-600">{course.hours}h</td>
                      <td className="px-lg py-md text-sm text-neutral-600">R$ {course.price.toFixed(2)}</td>
                      <td className="px-lg py-md text-sm">
                        <Badge status={course.status} />
                      </td>
                      <td className="px-lg py-md text-sm">
                        <div className="flex gap-md">
                          <button
                            onClick={() => handleOpenDialog(course)}
                            className="text-brand-600 hover:text-brand-700 transition-colors p-md"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          {course.status === 'active' ? (
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="text-danger-600 hover:text-danger-700 transition-colors p-md"
                              title="Marcar como inativo"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleHardDelete(course.id)}
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
                    <td colSpan={5} className="px-lg py-2xl text-center text-neutral-500">
                      Nenhum curso encontrado
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
