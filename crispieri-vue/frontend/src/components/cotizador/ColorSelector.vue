<template>
  <div v-if="store.productLineId" class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full bg-[#0D5C63] text-white text-xs font-bold flex items-center justify-center">4</span>
      <h3 class="text-sm font-semibold text-gray-800">Color del perfil</h3>
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="color in store.availableColors"
        :key="color.id"
        @click="store.setColor(color.id)"
        class="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border-2 transition-all"
        :class="store.colorId === color.id
          ? 'border-[#0D5C63] bg-[#0D5C63]/5 text-[#0D5C63] font-semibold'
          : 'border-gray-200 hover:border-gray-300 text-gray-600'"
      >
        <span
          class="w-4 h-4 rounded-full border border-gray-300"
          :style="{ backgroundColor: color.hexValue || '#ccc' }"
        />
        {{ color.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '@/stores/quoteStore'
const store = useQuoteStore()
</script>
