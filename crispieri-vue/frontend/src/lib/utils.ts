export function formatCurrency(n: number): string {
  return `$${Math.round(n).toLocaleString('es-CL')}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
