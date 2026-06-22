<template>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-gray-800">Resumen de cotización</h3>

    <div v-if="store.productLineId">
      <div class="text-center">
        <div class="text-xs text-gray-500 mb-1">Precio estimado</div>
        <div class="text-xl font-bold text-gray-800">
          {{ priceFormatted }}
        </div>
        <div v-if="store.priceEstimate" class="text-[10px] text-gray-400 mt-0.5">
          IVA incluido &middot; {{ store.quantity }} unidad(es)
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6 text-xs text-gray-400">
      Seleccione un producto para ver el precio
    </div>

    <div v-if="store.priceEstimate && store.priceEstimate.breakdown" class="border-t border-gray-100 pt-3 space-y-1.5">
      <div class="flex justify-between text-xs text-gray-500">
        <span>Subtotal (sin IVA)</span>
        <span>${{ formatPrice(store.priceEstimate.breakdown.total).replace('$', '') }}</span>
      </div>
      <div class="flex justify-between text-xs text-emerald-600">
        <span>Color {{ store.currentColor?.name }} ({{ diffPct }})</span>
        <span v-if="colorDiff !== 0">${{ Math.abs(colorDiff).toLocaleString('es-AR') }}</span>
        <span v-else>Sin recargo</span>
      </div>
    </div>

    <div class="border-t border-gray-100 pt-3 text-center">
      <p class="text-[10px] text-gray-400 leading-relaxed">
        Los precios son estimativos y pueden variar según configuración final.<br/>
        El cálculo definitivo se realiza al enviar la cotización.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuoteStore } from '@/stores/quoteStore'

const store = useQuoteStore()

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

const priceFormatted = computed(() => {
  if (!store.priceEstimate) return '—'
  return formatPrice(store.priceEstimate.finalPrice)
})

const diffPct = computed(() => {
  if (!store.priceEstimate?.breakdown) return '0%'
  const pct = store.priceEstimate.breakdown.colorMarginPct
  return pct > 0 ? `+${pct}%` : `${pct}%`
})

const colorDiff = computed(() => {
  if (!store.priceEstimate?.breakdown) return 0
  return store.priceEstimate.breakdown.colorMarginAmount
})
</script>
