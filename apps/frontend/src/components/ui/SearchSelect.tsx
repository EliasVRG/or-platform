import { forwardRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SearchSelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const SearchSelect = forwardRef<HTMLInputElement, SearchSelectProps>(
  ({ label, error, options, value, onChange, onBlur, className = '', ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedLabel = options.find((opt) => opt.value === value)?.label || '';

    const handleSelect = (optValue: string) => {
      onChange?.(optValue);
      setIsOpen(false);
      setSearchTerm('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setIsOpen(true);
    };

    return (
      <div className="space-y-md relative">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={isOpen ? searchTerm : selectedLabel}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setTimeout(() => setIsOpen(false), 200);
              onBlur?.();
            }}
            placeholder="Busque por nome..."
            className={`w-full px-md py-md text-base border rounded-md appearance-none transition-colors duration-fast pr-lg ${
              error
                ? 'border-danger-600 bg-danger-50 focus:ring-2 focus:ring-danger-600 focus:border-transparent'
                : 'border-neutral-300 hover:border-neutral-400 focus:ring-2 focus:ring-brand-600 focus:border-transparent'
            } ${className}`}
            {...props}
          />
          <ChevronDown
            size={18}
            className="absolute right-md top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none"
            strokeWidth={1.5}
          />

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-md bg-white border border-neutral-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className="w-full text-left px-md py-md hover:bg-brand-50 text-neutral-900 border-b border-neutral-100 last:border-b-0 transition-colors duration-fast text-sm"
                  >
                    {opt.label}
                  </button>
                ))
              ) : (
                <div className="px-md py-md text-neutral-500 text-sm">Nenhum resultado encontrado</div>
              )}
            </div>
          )}
        </div>
        {error && (
          <span className="text-sm font-medium text-danger-600">{error}</span>
        )}
      </div>
    );
  },
);

SearchSelect.displayName = 'SearchSelect';
