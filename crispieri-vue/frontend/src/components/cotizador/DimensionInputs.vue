<template>
  <div v-if="store.productLineId" class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full bg-[#0D5C63] text-white text-xs font-bold flex items-center justify-center">3</span>
      <h3 class="text-sm font-semibold text-gray-800">Dimensiones</h3>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Ancho (mm)</label>
        <input
          type="number"
          :value="store.widthMm"
          @input="store.setWidth(Number(($event.target as HTMLInputElement).value))"
          min="400" max="4000" step="1"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] outline-none"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Alto (mm)</label>
        <input
          type="number"
          :value="store.heightMm"
          @input="store.setHeight(Number(($event.target as HTMLInputElement).value))"
          min="400" max="3000" step="1"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] outline-none"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Paños</label>
        <input
          type="number"
          :value="store.panelCount"
          @input="store.setPanelCount(Number(($event.target as HTMLInputElement).value))"
          min="1" max="6" step="1"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] outline-none"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '@/stores/quoteStore'
const store = useQuoteStore()
</script>
