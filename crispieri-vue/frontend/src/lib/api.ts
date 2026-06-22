import type { CatalogData, CreateQuoteInput, QuoteResponse } from '@/types'

const API_BASE = import.meta.env.VITE_INSFORGE_URL || 'http://localhost:8080/functions/v1'

export async function fetchCatalog(): Promise<CatalogData> {
  const res = await fetch(`${API_BASE}/catalog`)
  if (!res.ok) throw new Error('Error al cargar catálogo')
  return res.json()
}

export async function fetchPricing(data: Record<string, unknown>): Promise<{ breakdown: Record<string, number>; records: unknown[] }> {
  const res = await fetch(`${API_BASE}/pricing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al calcular precio')
  return res.json()
}

export async function createQuote(data: CreateQuoteInput): Promise<QuoteResponse> {
  const res = await fetch(`${API_BASE}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(err.error || 'Error al crear cotización')
  }
  return res.json()
}

export async function fetchQuotes(params?: { page?: number; limit?: number; status?: string }): Promise<{ quotes: QuoteResponse[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const sp = new URLSearchParams()
  if (params?.page) sp.set('page', String(params.page))
  if (params?.limit) sp.set('limit', String(params.limit))
  if (params?.status) sp.set('status', params.status)
  const res = await fetch(`${API_BASE}/quotes?${sp.toString()}`)
  if (!res.ok) throw new Error('Error al listar cotizaciones')
  return res.json()
}

export async function fetchQuote(id: string): Promise<QuoteResponse> {
  const res = await fetch(`${API_BASE}/quotes/${id}`)
  if (!res.ok) throw new Error('Error al obtener cotización')
  return res.json()
}

export async function updateQuoteStatus(id: string, status: string): Promise<QuoteResponse> {
  const res = await fetch(`${API_BASE}/quotes/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Error al actualizar estado')
  return res.json()
}

export async function deleteQuote(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/quotes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar cotización')
}

// Catalog helpers
export function getAvailableGlassOptions(catalog: CatalogData, productLineId: string) {
  const ids = catalog.productLineGlass.filter(plg => plg.productLineId === productLineId).map(plg => plg.glassOptionId)
  return catalog.glassOptions.filter(g => ids.includes(g.id)).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function getGlassPrice(catalog: CatalogData, productLineId: string, glassOptionId: string): number {
  return catalog.productLineGlass.find(plg => plg.productLineId === productLineId && plg.glassOptionId === glassOptionId)?.pricePerM2 ?? 0
}

export function getRoundingMultiple(catalog: CatalogData, productLineId: string): number {
  return catalog.pricingRules.find(r => r.productLineId === productLineId && r.ruleType === 'rounding_multiple')?.value ?? 1000
}

export function getLaborCost(catalog: CatalogData, productLineId: string): number {
  return catalog.pricingRules.find(r => r.productLineId === productLineId && r.ruleType === 'labor_cost')?.value ?? 20000
}
