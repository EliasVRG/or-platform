import { AlertTriangle, Info } from 'lucide-react';
import { Button } from './Button';
import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 'danger' = ação permanente/irreversível. 'warning' = reversível (ex: inativar). */
  variant?: 'danger' | 'warning';
  loading?: boolean;
  /** Erro retornado pela última tentativa de confirmar (ex: bloqueio por dependência). */
  error?: string | null;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'warning',
  loading = false,
  error,
}: ConfirmDialogProps) {
  const isDanger = variant === 'danger';

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title}>
      <div className="space-y-lg">
        <div className={`flex gap-md p-lg rounded-md border ${
          isDanger
            ? 'bg-danger-50 border-danger-200 text-danger-700'
            : 'bg-warning-50 border-warning-200 text-warning-700'
        }`}>
          {isDanger ? (
            <AlertTriangle size={20} className="flex-shrink-0 mt-xs" />
          ) : (
            <Info size={20} className="flex-shrink-0 mt-xs" />
          )}
          <p className="text-sm leading-relaxed">{description}</p>
        </div>

        {error && (
          <div className="flex gap-md p-lg rounded-md border bg-danger-50 border-danger-200 text-danger-700">
            <AlertTriangle size={20} className="flex-shrink-0 mt-xs" />
            <p className="text-sm leading-relaxed">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-md">
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={isDanger ? 'danger' : 'primary'} onClick={onConfirm} disabled={loading}>
            {loading ? 'Processando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
