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
    <div className="w-56 bg-navy-900 text-white flex flex-col border-r border-navy-900">
      {/* Logo Section */}
      <div className="px-lg py-2xl border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">OR Platform</h1>
        <p className="text-xs text-white/60 mt-sm">Gerenciamento Educacional</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-sm py-lg">
        <ul className="space-y-xs">
          {navItems.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <NavLink
                to={href}
                className={({ isActive }) =>
                  `flex items-center gap-md px-md py-md rounded-md transition-all duration-fast group ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={20} className="flex-shrink-0" strokeWidth={1.5} />
                <span className="text-sm font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mx-md h-px bg-white/10" />

      {/* User Section */}
      <div className="px-md py-lg flex items-center gap-md">
        <div className="w-8 h-8 rounded-md bg-brand-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold">A</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">Professor</p>
          <p className="text-xs text-white/60 truncate">admin@platform</p>
        </div>
      </div>
    </div>
  );
}
