import { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="block text-sm font-medium text-gray-900">{label}</label>}
        <select
          ref={ref}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 ${
            error ? 'border-danger-500 bg-danger-50' : 'border-gray-300'
          } ${className}`}
          {...props}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {error && <span className="text-sm text-danger-600">{error}</span>}
      </div>
    );
  },
);

Select.displayName = 'Select';
