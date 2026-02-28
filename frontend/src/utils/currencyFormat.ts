/** Formats a value in COP cents to a display string e.g. "$ 3.000" */
export function formatCOP(cents: number): string {
  const pesos = cents / 100;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(pesos);
}
