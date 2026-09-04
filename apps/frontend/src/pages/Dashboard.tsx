import { useCourses } from '../hooks/useCourses';
import { useStudents } from '../hooks/useStudents';
import { useEnrollments } from '../hooks/useEnrollments';
import { Header } from '../components/layout/Header';
import { BookOpen, Users, UserCheck, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { courses } = useCourses();
  const { students } = useStudents();
  const { enrollments } = useEnrollments();

  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
  const activeEnrollments = enrollments.filter(e => e.status === 'active').length;
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending').length;
  const completionPercent = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

  const enrollmentStatusData = [
    { name: 'Pendente', value: enrollments.filter(e => e.status === 'pending').length, color: '#D97706' },
    { name: 'Ativo', value: enrollments.filter(e => e.status === 'active').length, color: '#059669' },
    { name: 'Concluído', value: enrollments.filter(e => e.status === 'completed').length, color: '#2563EB' },
    { name: 'Cancelado', value: enrollments.filter(e => e.status === 'canceled').length, color: '#DC2626' },
  ].filter(d => d.value > 0);

  const courseProgressData = courses.map(course => {
    const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
    const completed = courseEnrollments.filter(e => e.status === 'completed').length;
    const total = courseEnrollments.length;
    return {
      name: course.name.length > 12 ? course.name.slice(0, 12) + '...' : course.name,
      completed: completed || 0,
      pendentes: (total - completed) || 0,
      total: total || 0,
    };
  }).filter(d => d.total > 0);

  const stats = [
    { label: 'Cursos', value: courses.length, icon: BookOpen, color: 'bg-brand-50 text-brand-600' },
    { label: 'Alunos', value: students.length, icon: Users, color: 'bg-success-50 text-success-600' },
    { label: 'Matrículas', value: enrollments.length, icon: UserCheck, color: 'bg-warning-50 text-warning-600' },
  ];

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" subtitle="Visão geral do sistema de gerenciamento educacional" />

      <div className="flex-1 overflow-auto px-2xl py-2xl space-y-2xl">
        {/* Hero Section - Main Metric */}
        <div className="surface p-2xl">
          <div className="flex items-start justify-between gap-xl mb-lg">
            <div>
              <p className="text-sm font-medium text-neutral-600 mb-md">Taxa de Conclusão</p>
              <div className="flex items-baseline gap-md">
                <span className="text-5xl font-bold text-brand-600">{completionPercent}%</span>
                <span className="text-neutral-600">{completedEnrollments} de {totalEnrollments} matrículas</span>
              </div>
            </div>
            <CheckCircle size={32} className="text-success-600 flex-shrink-0" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-md">
            <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-600 to-brand-500 transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-lg text-sm">
              <div className="text-center">
                <p className="text-neutral-600">Concluídos</p>
                <p className="text-2xl font-bold text-success-600">{completedEnrollments}</p>
              </div>
              <div className="text-center">
                <p className="text-neutral-600">Em Progresso</p>
                <p className="text-2xl font-bold text-warning-600">{activeEnrollments}</p>
              </div>
              <div className="text-center">
                <p className="text-neutral-600">Pendentes</p>
                <p className="text-2xl font-bold text-neutral-600">{pendingEnrollments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="surface p-lg">
              <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-lg`}>
                <Icon size={24} />
              </div>
              <p className="text-sm text-neutral-600 mb-sm">{label}</p>
              <p className="text-4xl font-bold text-neutral-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          {/* Status Pie Chart */}
          {enrollmentStatusData.length > 0 && (
            <div className="surface p-lg">
              <div className="flex items-center gap-md mb-lg">
                <TrendingUp size={20} className="text-brand-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Distribuição de Matrículas</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={enrollmentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {enrollmentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Progress by Course */}
          {courseProgressData.length > 0 && (
            <div className="surface p-lg">
              <div className="flex items-center gap-md mb-lg">
                <Zap size={20} className="text-brand-600" />
                <h3 className="text-lg font-semibold text-neutral-900">Progresso por Curso</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#059669" name="Concluído" />
                  <Bar dataKey="pendentes" stackId="a" fill="#D97706" name="Pendente" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {[
            { title: 'Gerenciar Cursos', href: '/courses', icon: BookOpen, color: 'brand' },
            { title: 'Gerenciar Alunos', href: '/students', icon: Users, color: 'success' },
            { title: 'Gerenciar Matrículas', href: '/enrollments', icon: UserCheck, color: 'warning' },
          ].map(({ title, href, icon: Icon, color }) => (
            <Link
              key={href}
              to={href}
              className={`surface hover:shadow-md transition-shadow duration-normal p-lg group cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-lg">
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-brand-600 transition-colors">
                    {title}
                  </p>
                  <p className="text-sm text-neutral-600 mt-sm">Acessar módulo</p>
                </div>
                <div className={`p-md rounded-lg bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
