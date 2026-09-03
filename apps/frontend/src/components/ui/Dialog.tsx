import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-lg">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between px-2xl py-xl border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-neutral-500 hover:text-neutral-700 transition-colors duration-fast p-md -mr-md"
            aria-label="Close dialog"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="px-2xl py-xl">{children}</div>
      </div>
    </div>
  );
}
