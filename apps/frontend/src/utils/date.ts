/**
 * Formata uma data "YYYY-MM-DD" (ou ISO com horário) para "DD/MM/YYYY" sem
 * conversão de timezone. `new Date(str).toLocaleDateString()` desloca o dia
 * quando o valor vem sem horário (interpretado como meia-noite UTC) e o
 * timezone local está atrás de UTC.
 */
export function formatDate(value?: string | Date | null): string {
  if (!value) return '-';
  const raw = typeof value === 'string' ? value : value.toISOString();
  const datePart = raw.split('T')[0];
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) return '-';
  return `${day}/${month}/${year}`;
}
