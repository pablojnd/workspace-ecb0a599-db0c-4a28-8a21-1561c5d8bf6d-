<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader />

    <div class="bg-white border-b border-gray-100">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs font-medium text-gray-500">Paso {{ completedSteps.length }} de 8</span>
          <span class="text-xs font-medium text-emerald-600">{{ progressPct }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out" :style="{ width: `${progressPct}%` }" />
        </div>
      </div>
    </div>

    <div class="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6">
      <div v-if="store.catalogLoading" class="flex flex-col items-center justify-center py-20">
        <div class="w-8 h-8 border-4 border-[#0D5C63] border-t-transparent rounded-full animate-spin mb-3" />
        <p class="text-sm text-gray-500">Cargando catálogo...</p>
      </div>

      <div v-else-if="store.catalogError" class="flex flex-col items-center justify-center py-20">
        <p class="text-sm text-red-500">Error: {{ store.catalogError }}</p>
        <button @click="store.loadCatalog()" class="mt-3 px-4 py-2 text-sm bg-[#0D5C63] text-white rounded-lg hover:bg-[#0A4A50]">
          Reintentar
        </button>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 lg:w-2/3 space-y-6">
          <ProductTypeSelector />
          <LineSelector />
          <DimensionInputs />
          <ColorSelector />
          <GlassSelector />
          <AccessoriesSelector />
          <QuantityNotes />
          <ReviewStep />
        </div>

        <div class="lg:w-1/3">
          <div class="lg:sticky lg:top-[140px]">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <QuoteSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useQuoteStore } from '@/stores/quoteStore'
import AppHeader from '@/components/cotizador/AppHeader.vue'
import ProductTypeSelector from '@/components/cotizador/ProductTypeSelector.vue'
import LineSelector from '@/components/cotizador/LineSelector.vue'
import DimensionInputs from '@/components/cotizador/DimensionInputs.vue'
import ColorSelector from '@/components/cotizador/ColorSelector.vue'
import GlassSelector from '@/components/cotizador/GlassSelector.vue'
import AccessoriesSelector from '@/components/cotizador/AccessoriesSelector.vue'
import QuantityNotes from '@/components/cotizador/QuantityNotes.vue'
import ReviewStep from '@/components/cotizador/ReviewStep.vue'
import QuoteSummary from '@/components/cotizador/QuoteSummary.vue'

const store = useQuoteStore()
const completedSteps = computed(() => store.completedSteps)
const progressPct = computed(() => Math.round((completedSteps.value.length / 8) * 100))

onMounted(() => {
  store.loadCatalog()
  const draft = localStorage.getItem('crispieri_draft')
  if (draft) store.loadDraft()
})
</script>
