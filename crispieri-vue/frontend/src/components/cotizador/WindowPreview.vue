<template>
  <div v-if="lineCode" class="flex justify-center">
    <div
      class="relative rounded-xl overflow-hidden"
      :style="{
        width: `${previewScale * 2.5}px`,
        height: `${previewScale * 3}px`,
        backgroundColor: glassTint,
      }"
    >
      <div class="absolute inset-0 border-4" :style="{ borderColor: frameColor }">
        <div v-for="i in store.panelCount" :key="i"
          class="absolute top-0 bottom-0"
          :style="{
            left: `${((i - 1) / store.panelCount) * 100}%`,
            width: `${(1 / store.panelCount) * 100}%`,
            borderRight: i < store.panelCount ? `2px solid ${frameColor}` : 'none',
          }"
        />
      </div>

      <div v-if="crossbarsVertical > 0 || crossbarsHorizontal > 0" class="absolute inset-0 pointer-events-none">
        <template v-for="i in crossbarsVertical" :key="'v' + i">
          <div class="absolute top-0 bottom-0" :style="{ left: `${(i / (crossbarsVertical + 1)) * 100}%`, width: '2px', backgroundColor: frameColor }" />
        </template>
        <template v-for="i in crossbarsHorizontal" :key="'h' + i">
          <div class="absolute left-0 right-0" :style="{ top: `${(i / (crossbarsHorizontal + 1)) * 100}%`, height: '2px', backgroundColor: frameColor }" />
        </template>
      </div>

      <div v-if="isSliding && store.panelCount > 1" class="absolute inset-0 flex items-end justify-center pb-1.5">
        <span class="text-[8px] font-semibold opacity-60" :style="{ color: frameColor }">◄►</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useQuoteStore } from '@/stores/quoteStore'

const store = useQuoteStore()

const lineCode = computed(() => store.currentProductLine?.code)
const hexValue = computed(() => store.currentColor?.hexValue || '#1a1a1a')
const frameColor = computed(() => hexValue.value.startsWith('#') ? hexValue.value : `#${hexValue.value}`)
const glassTint = computed(() => {
  const go = store.currentGlassOption
  if (!go) return '#c8d6e0'
  return go.id.includes('transparente') || go.id.includes('incoloro') ? '#c8d6e0' : go.id.includes('bronce') ? '#b8956a' : go.id.includes('gris') ? '#889098' : '#c8d6e0'
})
const isSliding = computed(() => store.currentProductType?.code === 'corredera')

const aspectRatio = computed(() => store.widthMm && store.heightMm ? store.widthMm / store.heightMm : 5 / 6)
const previewScale = computed(() => Math.min(120, 300 / Math.max(aspectRatio.value, 0.5)))

const crossbarsVertical = computed(() => {
  const c = store.currentProductLine?.properties as Record<string, unknown> | undefined
  return (c?.crossbarsVertical as number) || 0
})
const crossbarsHorizontal = computed(() => {
  const c = store.currentProductLine?.properties as Record<string, unknown> | undefined
  return (c?.crossbarsHorizontal as number) || 0
})
</script>
