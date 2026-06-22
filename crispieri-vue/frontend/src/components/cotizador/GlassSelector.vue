<template>
  <div v-if="store.productLineId" class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full bg-[#0D5C63] text-white text-xs font-bold flex items-center justify-center">5</span>
      <h3 class="text-sm font-semibold text-gray-800">Vidrio</h3>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      <button
        v-for="glass in store.availableGlassOptions"
        :key="glass.id"
        @click="store.setGlassOption(glass.id)"
        class="px-3 py-2 text-xs rounded-xl border-2 transition-all text-left"
        :class="store.glassOptionId === glass.id
          ? 'border-[#0D5C63] bg-[#0D5C63]/5 text-[#0D5C63] font-semibold'
          : 'border-gray-200 hover:border-gray-300 text-gray-600'"
      >
        {{ glass.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '@/stores/quoteStore'
const store = useQuoteStore()
</script>
