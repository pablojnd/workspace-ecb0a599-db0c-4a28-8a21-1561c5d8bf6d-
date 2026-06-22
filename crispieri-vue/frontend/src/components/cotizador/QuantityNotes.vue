<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full bg-[#0D5C63] text-white text-xs font-bold flex items-center justify-center">7</span>
      <h3 class="text-sm font-semibold text-gray-800">Cantidad y observaciones</h3>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Cantidad</label>
        <input
          type="number"
          :value="store.quantity"
          @input="store.setQuantity(Number(($event.target as HTMLInputElement).value))"
          min="1" max="100"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] outline-none"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1">Observaciones</label>
        <textarea
          :value="store.observations"
          @input="store.setObservations(($event.target as HTMLTextAreaElement).value)"
          rows="1"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] outline-none resize-none"
          placeholder="Notas adicionales..."
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '@/stores/quoteStore'
const store = useQuoteStore()
</script>
