import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', placeholder, ...props }, ref) => {
    return (
      <div className="space-y-md">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-md py-md pr-lg text-base border rounded-md appearance-none transition-colors duration-fast placeholder:text-neutral-400 bg-white ${
              error
                ? 'border-danger-600 focus:ring-2 focus:ring-danger-600 focus:border-transparent'
                : 'border-neutral-300 hover:border-neutral-400 focus:ring-2 focus:ring-brand-600 focus:border-transparent'
            } ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-md top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
            strokeWidth={1.5}
          />
        </div>
        {error && (
          <span className="text-sm font-medium text-danger-600">{error}</span>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
