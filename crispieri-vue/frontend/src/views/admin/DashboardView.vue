<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-6 py-3">
      <div class="max-w-[1600px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-8 h-8 bg-[#0D5C63] rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-sm">C</span>
          </div>
          <h1 class="text-sm font-bold text-gray-800">Panel de Administración</h1>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink to="/admin/catalog" class="text-xs text-gray-500 hover:text-[#0D5C63]">Catálogo</RouterLink>
          <RouterLink to="/" class="text-xs text-gray-400 hover:text-[#0D5C63]">Cotizador</RouterLink>
        </div>
      </div>
    </header>

    <div class="max-w-[1600px] mx-auto px-6 py-6">
      <h2 class="text-lg font-bold text-gray-800 mb-4">Cotizaciones</h2>

      <div v-if="loading" class="flex items-center gap-2 py-8">
        <div class="w-5 h-5 border-2 border-[#0D5C63] border-t-transparent rounded-full animate-spin" />
        <span class="text-sm text-gray-500">Cargando cotizaciones...</span>
      </div>

      <div v-else-if="error" class="text-sm text-red-500">Error: {{ error }}</div>

      <div v-else-if="quotes.length === 0" class="text-center py-12 text-sm text-gray-400">
        No hay cotizaciones registradas.
      </div>

      <div v-else class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr>
              <th class="px-4 py-3 font-medium">ID</th>
              <th class="px-4 py-3 font-medium">Cliente</th>
              <th class="px-4 py-3 font-medium">Producto</th>
              <th class="px-4 py-3 font-medium">Total</th>
              <th class="px-4 py-3 font-medium">Estado</th>
              <th class="px-4 py-3 font-medium">Fecha</th>
              <th class="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="q in quotes" :key="q.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-4 py-3 font-mono text-xs">{{ q.id.slice(0, 8) }}…</td>
              <td class="px-4 py-3">{{ q.customerName || q.customerEmail || '—' }}</td>
              <td class="px-4 py-3 text-xs">{{ q.items?.[0]?.productTypeName || '—' }}</td>
              <td class="px-4 py-3 font-medium">${{ q.totalAmount?.toLocaleString('es-AR') }}</td>
              <td class="px-4 py-3">
                <span
                  class="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full"
                  :class="statusClass(q.status)"
                >
                  {{ q.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-gray-400">
                {{ q.createdAt ? new Date(q.createdAt).toLocaleDateString('es-AR') : '—' }}
              </td>
              <td class="px-4 py-3">
                <RouterLink
                  :to="`/admin/quote/${q.id}`"
                  class="text-xs text-[#0D5C63] hover:underline"
                >
                  Ver
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchQuotes } from '@/lib/api'
import type { QuoteResponse } from '@/types'

const quotes = ref<QuoteResponse[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

function statusClass(status?: string) {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-600'
    case 'pending': return 'bg-amber-100 text-amber-700'
    case 'approved': return 'bg-emerald-100 text-emerald-700'
    case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}

onMounted(async () => {
  try {
    quotes.value = await fetchQuotes()
  } catch (err: unknown) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
})
</script>
