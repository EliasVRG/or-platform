import { useCourses } from '../hooks/useCourses';
import { useStudents } from '../hooks/useStudents';
import { useEnrollments } from '../hooks/useEnrollments';
import { Header } from '../components/layout/Header';
import { BookOpen, Users, UserCheck } from 'lucide-react';

export function Dashboard() {
  const { courses } = useCourses();
  const { students } = useStudents();
  const { enrollments } = useEnrollments();

  const stats = [
    { label: 'Cursos', value: courses.length, icon: BookOpen, color: 'text-brand-600' },
    { label: 'Alunos', value: students.length, icon: Users, color: 'text-success-600' },
    { label: 'Matrículas', value: enrollments.length, icon: UserCheck, color: 'text-warning-600' },
  ];

  return (
    <div>
      <Header title="Dashboard" subtitle="Bem-vindo ao OR Platform" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{label}</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <Icon className={`${color}`} size={40} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
