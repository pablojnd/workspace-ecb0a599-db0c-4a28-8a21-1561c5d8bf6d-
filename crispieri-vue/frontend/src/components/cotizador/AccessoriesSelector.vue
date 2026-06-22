<template>
  <div v-if="store.availableAccessories.length > 0" class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full bg-[#0D5C63] text-white text-xs font-bold flex items-center justify-center">6</span>
      <h3 class="text-sm font-semibold text-gray-800">Accesorios</h3>
    </div>
    <div class="space-y-2">
      <div
        v-for="acc in store.availableAccessories"
        :key="acc.id"
        class="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200"
      >
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="isSelected(acc.id)"
            @change="store.toggleAccessory(acc.id)"
            class="w-4 h-4 accent-[#0D5C63]"
          />
          <div>
            <span class="text-sm text-gray-700">{{ acc.name }}</span>
            <span class="text-xs text-gray-400 ml-2">${{ acc.price.toLocaleString('es-AR') }}</span>
          </div>
        </div>
        <div v-if="isSelected(acc.id)" class="flex items-center gap-2">
          <input
            type="number"
            :value="getQuantity(acc.id)"
            @input="store.setAccessoryQuantity(acc.id, Number(($event.target as HTMLInputElement).value))"
            min="1" max="99"
            class="w-16 px-2 py-1 text-xs border border-gray-300 rounded-lg text-center"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuoteStore } from '@/stores/quoteStore'
const store = useQuoteStore()

function isSelected(id: string) {
  return store.selectedAccessories.some(a => a.accessoryId === id)
}
function getQuantity(id: string) {
  return store.selectedAccessories.find(a => a.accessoryId === id)?.quantity ?? 1
}
</script>
