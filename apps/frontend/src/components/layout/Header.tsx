import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
