<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-200 px-6 py-3">
      <div class="max-w-[1600px] mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <RouterLink to="/admin" class="text-xs text-gray-400 hover:text-[#0D5C63]">&larr; Volver</RouterLink>
          <h1 class="text-sm font-bold text-gray-800">Catálogo</h1>
        </div>
      </div>
    </header>

    <div class="max-w-[1600px] mx-auto px-6 py-6">
      <div v-if="store.catalogLoading" class="flex items-center gap-2 py-8">
        <div class="w-5 h-5 border-2 border-[#0D5C63] border-t-transparent rounded-full animate-spin" />
        <span class="text-sm text-gray-500">Cargando catálogo...</span>
      </div>

      <div v-else-if="!store.catalog" class="text-center py-12 text-sm text-gray-400">
        No se pudo cargar el catálogo.
      </div>

      <div v-else class="space-y-8">
        <section>
          <h2 class="text-sm font-semibold text-gray-800 mb-3">Tipos de producto</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="pt in store.catalog.productTypes" :key="pt.id"
              class="bg-white rounded-xl border border-gray-200 p-4"
            >
              <h3 class="text-sm font-medium">{{ pt.name }}</h3>
              <p class="text-[10px] text-gray-400 mt-1">{{ pt.code }}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-sm font-semibold text-gray-800 mb-3">Líneas de producto</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div v-for="line in store.catalog.productLines" :key="line.id"
              class="bg-white rounded-xl border border-gray-200 p-4"
            >
              <h3 class="text-sm font-medium">{{ line.name }}</h3>
              <p class="text-[10px] text-gray-400 mt-1">{{ line.code }} · Margen: {{ line.marginPct }}% / {{ line.marginPctCafe }}%</p>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-sm font-semibold text-gray-800 mb-3">Colores</h2>
          <div class="flex flex-wrap gap-2">
            <div v-for="color in store.catalog.colors" :key="color.id"
              class="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2"
            >
              <span class="w-4 h-4 rounded-full border border-gray-300" :style="{ backgroundColor: color.hexValue || '#ccc' }" />
              <span class="text-xs">{{ color.name }} {{ color.marginPct ? `(${color.marginPct > 0 ? '+' : ''}${color.marginPct}%)` : '' }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useQuoteStore } from '@/stores/quoteStore'

const store = useQuoteStore()
onMounted(() => store.loadCatalog())
</script>
