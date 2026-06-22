<template>
  <header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
    <div class="max-w-[1600px] mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-[#0D5C63] rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-sm">C</span>
        </div>
        <div>
          <h1 class="text-sm font-bold text-gray-800">Crispieri Cotizador</h1>
          <p class="text-[10px] text-gray-400">Sistema de cotización online</p>
        </div>
      </div>
      <RouterLink to="/admin" class="text-xs text-gray-400 hover:text-[#0D5C63] transition-colors">
        Admin
      </RouterLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
