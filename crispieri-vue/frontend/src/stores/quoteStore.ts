import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  fetchCatalog, getAvailableGlassOptions, getGlassPrice,
  getRoundingMultiple, getLaborCost, createQuote,
} from '@/lib/api'
import { estimatePrice } from '@/lib/pricing'
import type {
  CatalogData, ProductType, ProductLine, Color, GlassOption,
  Accessory, QuoteItemInput, QuoteResponse,
} from '@/types'

export interface SelectedAccessory {
  accessoryId: string
  quantity: number
}

export const useQuoteStore = defineStore('quote', () => {
  const catalog = ref<CatalogData | null>(null)
  const catalogLoading = ref(false)
  const catalogError = ref<string | null>(null)

  const productTypeId = ref<string | null>(null)
  const productLineId = ref<string | null>(null)
  const widthMm = ref(1200)
  const heightMm = ref(1500)
  const panelCount = ref(2)
  const colorId = ref<string | null>(null)
  const glassOptionId = ref<string | null>(null)
  const selectedAccessories = ref<SelectedAccessory[]>([])
  const quantity = ref(1)
  const observations = ref('')

  const submitting = ref(false)
  const submitError = ref<string | null>(null)
  const lastQuote = ref<QuoteResponse | null>(null)

  const priceEstimate = ref<ReturnType<typeof estimatePrice> | null>(null)

  const currentProductType = computed<ProductType | null>(() => {
    if (!catalog.value || !productTypeId.value) return null
    return catalog.value.productTypes.find(pt => pt.id === productTypeId.value) ?? null
  })

  const currentProductLine = computed<ProductLine | null>(() => {
    if (!catalog.value || !productLineId.value) return null
    return catalog.value.productLines.find(pl => pl.id === productLineId.value) ?? null
  })

  const currentColor = computed<Color | null>(() => {
    if (!catalog.value || !colorId.value) return null
    return catalog.value.colors.find(c => c.id === colorId.value) ?? null
  })

  const currentGlassOption = computed<GlassOption | null>(() => {
    if (!catalog.value || !glassOptionId.value) return null
    return catalog.value.glassOptions.find(g => g.id === glassOptionId.value) ?? null
  })

  const availableLines = computed<ProductLine[]>(() => {
    if (!catalog.value || !productTypeId.value) return []
    const lineIds = catalog.value.productTypeLines
      .filter(ptl => ptl.productTypeId === productTypeId.value)
      .map(ptl => ptl.productLineId)
    return catalog.value.productLines.filter(pl => lineIds.includes(pl.id)).sort((a, b) => a.sortOrder - b.sortOrder)
  })

  const availableColors = computed<Color[]>(() => {
    if (!catalog.value || !productLineId.value) return []
    const colorIds = catalog.value.productLineColors
      .filter(plc => plc.productLineId === productLineId.value)
      .map(plc => plc.colorId)
    return catalog.value.colors.filter(c => colorIds.includes(c.id)).sort((a, b) => a.sortOrder - b.sortOrder)
  })

  const availableGlassOptions = computed<GlassOption[]>(() => {
    if (!catalog.value || !productLineId.value) return []
    return getAvailableGlassOptions(catalog.value, productLineId.value)
  })

  const availableAccessories = computed<Accessory[]>(() => {
    if (!catalog.value || !productLineId.value) return []
    const ids = catalog.value.productLineAccessories
      .filter(pla => pla.productLineId === productLineId.value)
      .map(pla => pla.accessoryId)
    return catalog.value.accessories.filter(a => ids.includes(a.id)).sort((a, b) => a.sortOrder - b.sortOrder)
  })

  const completedSteps = computed<number[]>(() => {
    const steps: number[] = []
    if (productTypeId.value) steps.push(1)
    if (productLineId.value) steps.push(2)
    if (widthMm.value > 0 && heightMm.value > 0) steps.push(3)
    if (colorId.value) steps.push(4)
    if (glassOptionId.value) steps.push(5)
    steps.push(6)
    if (quantity.value > 0) steps.push(7)
    if (productTypeId.value && productLineId.value && widthMm.value > 0 && heightMm.value > 0 && colorId.value && glassOptionId.value) {
      steps.push(8)
    }
    return steps
  })

  async function loadCatalog() {
    catalogLoading.value = true
    catalogError.value = null
    try {
      catalog.value = await fetchCatalog()
      if (catalog.value.productTypes.length > 0 && !productTypeId.value) {
        setProductType(catalog.value.productTypes.sort((a, b) => a.sortOrder - b.sortOrder)[0].id)
      }
    } catch (err: unknown) {
      catalogError.value = (err as Error).message
    } finally {
      catalogLoading.value = false
    }
  }

  function setProductType(id: string) {
    productTypeId.value = id
    productLineId.value = null
    colorId.value = null
    glassOptionId.value = null
    selectedAccessories.value = []
    const lines = catalog.value?.productTypeLines.filter(ptl => ptl.productTypeId === id).map(ptl => ptl.productLineId) ?? []
    const firstLine = catalog.value?.productLines.filter(pl => lines.includes(pl.id)).sort((a, b) => a.sortOrder - b.sortOrder)[0]
    if (firstLine) setProductLine(firstLine.id)
  }

  function setProductLine(id: string) {
    productLineId.value = id
    colorId.value = null
    glassOptionId.value = null
    selectedAccessories.value = []

    if (catalog.value) {
      const colors = catalog.value.productLineColors.filter(plc => plc.productLineId === id).map(plc => plc.colorId)
      const firstColor = catalog.value.colors.filter(c => colors.includes(c.id)).sort((a, b) => a.sortOrder - b.sortOrder)[0]
      if (firstColor) colorId.value = firstColor.id

      const glass = getAvailableGlassOptions(catalog.value, id)
      if (glass.length > 0) glassOptionId.value = glass[0].id
    }
    recalculatePrice()
  }

  function setWidth(mm: number) { widthMm.value = Math.max(400, Math.min(4000, mm)); recalculatePrice() }
  function setHeight(mm: number) { heightMm.value = Math.max(400, Math.min(3000, mm)); recalculatePrice() }
  function setPanelCount(count: number) { panelCount.value = Math.max(1, Math.min(6, count)); recalculatePrice() }

  function setColor(id: string) { colorId.value = id; recalculatePrice() }
  function setGlassOption(id: string) { glassOptionId.value = id; recalculatePrice() }

  function toggleAccessory(id: string) {
    const idx = selectedAccessories.value.findIndex(a => a.accessoryId === id)
    if (idx >= 0) {
      selectedAccessories.value = selectedAccessories.value.filter(a => a.accessoryId !== id)
    } else {
      selectedAccessories.value = [...selectedAccessories.value, { accessoryId: id, quantity: 1 }]
    }
    recalculatePrice()
  }

  function setAccessoryQuantity(id: string, qty: number) {
    selectedAccessories.value = selectedAccessories.value.map(a =>
      a.accessoryId === id ? { ...a, quantity: Math.max(1, qty) } : a
    )
    recalculatePrice()
  }

  function setQuantity(qty: number) { quantity.value = Math.max(1, Math.min(100, qty)); recalculatePrice() }
  function setObservations(obs: string) { observations.value = obs }

  function recalculatePrice() {
    const line = currentProductLine.value
    const color = currentColor.value
    const cat = catalog.value

    if (!line || !color || !cat || !glassOptionId.value) {
      priceEstimate.value = null
      return
    }

    const glassPricePerM2 = getGlassPrice(cat, line.id, glassOptionId.value)
    if (glassPricePerM2 === 0) { priceEstimate.value = null; return }

    const accessoryPrices = selectedAccessories.value.map(sa => {
      const acc = cat.accessories.find(a => a.id === sa.accessoryId)
      return { price: acc?.price || 0, priceCafe: acc?.priceCafe || 0, code: acc?.code || '', quantity: sa.quantity }
    })

    const lineProfilePrices = cat.profilePrices.filter(pp => pp.productLineId === line.id)

    priceEstimate.value = estimatePrice({
      widthMm: widthMm.value,
      heightMm: heightMm.value,
      panelCount: panelCount.value,
      quantity: quantity.value,
      productLineCode: line.code,
      productTypeCode: currentProductType.value?.code || 'corredera',
      marginPct: line.marginPct,
      marginPctCafe: line.marginPctCafe,
      colorCode: color.code,
      glassPricePerM2,
      accessoryPrices,
      profilePrices: lineProfilePrices,
      laborCost: getLaborCost(cat, line.id),
      roundingMultiple: getRoundingMultiple(cat, line.id),
    })
  }

  async function submitQuote() {
    if (!productTypeId.value || !productLineId.value || !glassOptionId.value || !colorId.value) {
      submitError.value = 'Complete todos los campos requeridos'
      return null
    }

    submitting.value = true
    submitError.value = null

    const item: QuoteItemInput = {
      productTypeId: productTypeId.value,
      productLineId: productLineId.value,
      glassOptionId: glassOptionId.value,
      colorId: colorId.value,
      widthMm: widthMm.value,
      heightMm: heightMm.value,
      panelCount: panelCount.value,
      quantity: quantity.value,
      observations: observations.value || undefined,
      accessories: selectedAccessories.value,
    }

    try {
      const quote = await createQuote({ notes: observations.value || undefined, items: [item] })
      lastQuote.value = quote
      return quote
    } catch (err: unknown) {
      submitError.value = (err as Error).message
      return null
    } finally {
      submitting.value = false
    }
  }

  function saveDraft() {
    const draft = {
      productTypeId: productTypeId.value,
      productLineId: productLineId.value,
      widthMm: widthMm.value,
      heightMm: heightMm.value,
      panelCount: panelCount.value,
      colorId: colorId.value,
      glassOptionId: glassOptionId.value,
      selectedAccessories: selectedAccessories.value,
      quantity: quantity.value,
      observations: observations.value,
    }
    localStorage.setItem('crispieri_draft', JSON.stringify(draft))
  }

  function loadDraft() {
    const raw = localStorage.getItem('crispieri_draft')
    if (!raw) return
    try {
      const d = JSON.parse(raw)
      productTypeId.value = d.productTypeId
      productLineId.value = d.productLineId
      widthMm.value = d.widthMm || 1200
      heightMm.value = d.heightMm || 1500
      panelCount.value = d.panelCount || 2
      colorId.value = d.colorId
      glassOptionId.value = d.glassOptionId
      selectedAccessories.value = d.selectedAccessories || []
      quantity.value = d.quantity || 1
      observations.value = d.observations || ''
      setTimeout(() => recalculatePrice(), 100)
    } catch { /* ignore */ }
  }

  function resetConfig() {
    const cat = catalog.value
    productTypeId.value = null
    productLineId.value = null
    widthMm.value = 1200
    heightMm.value = 1500
    panelCount.value = 2
    colorId.value = null
    glassOptionId.value = null
    selectedAccessories.value = []
    quantity.value = 1
    observations.value = ''
    priceEstimate.value = null
    lastQuote.value = null
    localStorage.removeItem('crispieri_draft')
    if (cat && cat.productTypes.length > 0) {
      setProductType(cat.productTypes.sort((a, b) => a.sortOrder - b.sortOrder)[0].id)
    }
  }

  return {
    catalog, catalogLoading, catalogError,
    productTypeId, productLineId, widthMm, heightMm, panelCount,
    colorId, glassOptionId, selectedAccessories, quantity, observations,
    submitting, submitError, lastQuote, priceEstimate,
    currentProductType, currentProductLine, currentColor, currentGlassOption,
    availableLines, availableColors, availableGlassOptions, availableAccessories,
    completedSteps,
    loadCatalog, setProductType, setProductLine,
    setWidth, setHeight, setPanelCount, setColor, setGlassOption,
    toggleAccessory, setAccessoryQuantity, setQuantity, setObservations,
    recalculatePrice, submitQuote, saveDraft, loadDraft, resetConfig,
  }
})
