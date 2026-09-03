import type { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2';

  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-danger-600 text-white hover:bg-danger-700',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
