<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-6 py-3">
      <div class="max-w-[1600px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <RouterLink to="/admin" class="text-xs text-gray-400 hover:text-[#0D5C63]">&larr; Volver</RouterLink>
          <h1 class="text-sm font-bold text-gray-800">Cotización #{{ idPreview }}</h1>
        </div>
      </div>
    </header>

    <div class="max-w-[1600px] mx-auto px-6 py-6">
      <div v-if="loading" class="flex items-center gap-2 py-8">
        <div class="w-5 h-5 border-2 border-[#0D5C63] border-t-transparent rounded-full animate-spin" />
        <span class="text-sm text-gray-500">Cargando...</span>
      </div>

      <div v-else-if="error" class="text-sm text-red-500">Error: {{ error }}</div>

      <div v-else-if="quote" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 class="text-sm font-semibold text-gray-800 mb-3">Detalle</h2>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between"><span class="text-gray-500">Cliente</span><span>{{ quote.customerName || quote.customerEmail || '—' }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Estado</span><span>{{ quote.status }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Subtotal</span><span>${{ quote.subtotalAmount?.toLocaleString('es-AR') }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">IVA</span><span>${{ ((quote.totalAmount || 0) - (quote.subtotalAmount || 0)).toLocaleString('es-AR') }}</span></div>
              <div class="flex justify-between font-bold"><span class="text-gray-800">Total</span><span>${{ quote.totalAmount?.toLocaleString('es-AR') }}</span></div>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 class="text-sm font-semibold text-gray-800 mb-3">Items</h2>
            <div v-for="(item, i) in quote.items" :key="i" class="border-b border-gray-100 last:border-0 pb-3 mb-3 last:mb-0 last:pb-0">
              <div class="text-xs text-gray-500 mb-1">{{ item.productTypeName }} / {{ item.productLineName }}</div>
              <div class="text-sm">{{ item.widthMm }}×{{ item.heightMm }}mm · {{ item.panelCount }} paños · {{ item.quantity }} unid.</div>
              <div class="text-sm font-medium mt-1">${{ item.unitPrice?.toLocaleString('es-AR') }} c/u</div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-white rounded-2xl border border-gray-200 p-5">
            <h2 class="text-sm font-semibold text-gray-800 mb-3">Acciones</h2>
            <div class="space-y-2">
              <button
                @click="updateStatus('approved')"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Aprobar
              </button>
              <button
                @click="updateStatus('rejected')"
                class="w-full px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-xl hover:bg-red-50 transition-colors"
              >
                Rechazar
              </button>
              <button
                @click="updateStatus('pending')"
                class="w-full px-4 py-2 text-sm font-medium text-amber-600 bg-white border border-amber-300 rounded-xl hover:bg-amber-50 transition-colors"
              >
                Marcar pendiente
              </button>
            </div>
            <div v-if="actionError" class="text-xs text-red-500 mt-2">{{ actionError }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { fetchQuote, updateQuoteStatus } from '@/lib/api'
import type { QuoteResponse } from '@/types'

const route = useRoute()
const quote = ref<QuoteResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const actionError = ref<string | null>(null)

const idPreview = computed(() => route.params.id.toString().slice(0, 8))

async function updateStatus(status: string) {
  actionError.value = null
  try {
    const updated = await updateQuoteStatus(route.params.id as string, status)
    quote.value = updated
  } catch (err: unknown) {
    actionError.value = (err as Error).message
  }
}

onMounted(async () => {
  try {
    quote.value = await fetchQuote(route.params.id as string)
  } catch (err: unknown) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
})
</script>
