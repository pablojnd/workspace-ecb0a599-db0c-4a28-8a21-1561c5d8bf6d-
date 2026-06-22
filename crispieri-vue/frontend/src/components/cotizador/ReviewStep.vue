<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">8</span>
      <h3 class="text-sm font-semibold text-gray-800">Revisión y envío</h3>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div v-if="store.currentProductType" class="flex justify-between text-sm">
        <span class="text-gray-500">Tipo</span>
        <span class="font-medium">{{ store.currentProductType.name }}</span>
      </div>
      <div v-if="store.currentProductLine" class="flex justify-between text-sm">
        <span class="text-gray-500">Línea</span>
        <span class="font-medium">{{ store.currentProductLine.name }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Dimensiones</span>
        <span class="font-medium">{{ store.widthMm }}×{{ store.heightMm }}mm · {{ store.panelCount }} paño(s)</span>
      </div>
      <div v-if="store.currentColor" class="flex justify-between text-sm">
        <span class="text-gray-500">Color</span>
        <span class="font-medium">{{ store.currentColor.name }}</span>
      </div>
      <div v-if="store.currentGlassOption" class="flex justify-between text-sm">
        <span class="text-gray-500">Vidrio</span>
        <span class="font-medium">{{ store.currentGlassOption.name }}</span>
      </div>
      <div v-if="store.selectedAccessories.length > 0" class="flex justify-between text-sm">
        <span class="text-gray-500">Accesorios</span>
        <span class="font-medium">{{ store.selectedAccessories.length }} seleccionados</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-500">Cantidad</span>
        <span class="font-medium">{{ store.quantity }} unidad(es)</span>
      </div>
    </div>

    <div class="flex gap-3 pt-1">
      <button
        @click="store.saveDraft()"
        class="px-5 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
      >
        Guardar borrador
      </button>
      <button
        @click="handlerSubmit"
        :disabled="store.submitting || !canSubmit"
        class="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-[#0D5C63] rounded-xl hover:bg-[#0A4A50] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span v-if="store.submitting" class="flex items-center justify-center gap-2">
          <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Enviando...
        </span>
        <span v-else>Enviar cotización</span>
      </button>
    </div>

    <div v-if="store.submitError" class="text-xs text-red-500">{{ store.submitError }}</div>

    <div v-if="store.lastQuote" class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <p class="text-sm font-semibold text-emerald-700 mb-2">Cotización enviada exitosamente</p>
      <p class="text-xs text-emerald-600">ID: {{ store.lastQuote.id }}</p>
      <button
        @click="store.resetConfig()"
        class="mt-3 px-4 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
      >
        Nueva cotización
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuoteStore } from '@/stores/quoteStore'

const store = useQuoteStore()

const canSubmit = computed(() =>
  !!store.productTypeId && !!store.productLineId &&
  store.widthMm > 0 && store.heightMm > 0 &&
  !!store.colorId && !!store.glassOptionId &&
  store.quantity > 0
)

async function handlerSubmit() {
  await store.submitQuote()
}
</script>
