import { NavLink } from 'react-router-dom';
import { BookOpen, Users, UserCheck, LayoutDashboard } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Cursos', href: '/courses', icon: BookOpen },
    { label: 'Alunos', href: '/students', icon: Users },
    { label: 'Matrículas', href: '/enrollments', icon: UserCheck },
  ];

  return (
    <div className="w-64 bg-brand-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-brand-800">
        <h1 className="text-2xl font-bold">OR Platform</h1>
        <p className="text-xs text-brand-200">Grupo Oliveira Rocha</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <NavLink
                to={href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-brand-200 hover:bg-brand-800'
                  }`
                }
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-brand-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-400 flex items-center justify-center">
          <span className="text-sm font-bold">AR</span>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Admin</p>
          <p className="text-xs text-brand-200">admin@orplatform.com</p>
        </div>
      </div>
    </div>
  );
}
