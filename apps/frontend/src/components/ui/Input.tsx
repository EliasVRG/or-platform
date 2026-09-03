import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-md">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-md py-md text-base border rounded-md transition-colors duration-fast placeholder:text-neutral-400 ${
            error
              ? 'border-danger-600 bg-danger-50 focus:ring-2 focus:ring-danger-600 focus:border-transparent'
              : 'border-neutral-300 hover:border-neutral-400 focus:ring-2 focus:ring-brand-600 focus:border-transparent'
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-sm font-medium text-danger-600">{error}</span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
