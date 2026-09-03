import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="px-2xl py-xl flex items-start justify-between gap-xl">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
          {subtitle && (
            <p className="text-neutral-600 text-sm mt-md">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
