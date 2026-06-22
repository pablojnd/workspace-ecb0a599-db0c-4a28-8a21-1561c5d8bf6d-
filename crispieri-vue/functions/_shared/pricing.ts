export interface ProfilePriceInput {
  profileName: string
  profileCode: string
  priceNatural: number
  priceCafe: number
  stripLengthM: number
}

export interface AccessoryPriceInput {
  name: string
  code: string
  price: number
  priceCafe: number
  unit: string
  quantity: number
}

export interface PriceCalculationInput {
  widthMm: number
  heightMm: number
  panelCount: number
  quantity: number
  productLineCode: string
  productTypeCode: string
  marginPct: number
  marginPctCafe: number
  colorCode: string
  glassPricePerM2: number
  profilePrices: ProfilePriceInput[]
  accessoryPrices: AccessoryPriceInput[]
  laborCost: number
  roundingMultiple: number
}

export interface PriceBreakdown {
  areaM2: number
  perimeterM: number
  profilesTotal: number
  glassTotal: number
  accessoriesTotal: number
  laborTotal: number
  subtotal: number
  marginAmount: number
  marginMultiplier: number
  preTotal: number
  tax: number
  total: number
  unitTotal: number
}

function getProfileUsage(
  widthMm: number,
  heightMm: number,
  panelCount: number,
  productTypeCode: string,
  _productLineCode: string,
  profilePrices: ProfilePriceInput[]
): { profile: ProfilePriceInput; metersUsed: number }[] {
  const widthM = widthMm / 1000
  const heightM = heightMm / 1000
  const usage: { profile: ProfilePriceInput; metersUsed: number }[] = []

  for (const profile of profilePrices) {
    let metersUsed = 0
    const name = profile.profileName.toLowerCase()
    const code = profile.profileCode.toLowerCase()

    if (productTypeCode === 'corredera') {
      if (name.includes('riel inferior') || name.includes('riel superior')) {
        metersUsed = widthM * panelCount
      } else if (name.includes('jamba') && !name.includes('esquinera')) {
        metersUsed = heightM * 2
      } else if (name.includes('cabecera inferior') || name.includes('cabecera superior')) {
        metersUsed = widthM
      } else if (name.includes('traslapo')) {
        metersUsed = heightM * Math.max(0, panelCount - 1)
      } else if (name.includes('pierna')) {
        metersUsed = heightM * panelCount
      } else if (name.includes('palillo')) {
        metersUsed = heightM * panelCount
      } else if (name.includes('4ª hoja') || name.includes('4a hoja')) {
        if (panelCount >= 4) metersUsed = widthM * (panelCount - 3)
      } else if (name.includes('placa aluminio')) {
        if (panelCount >= 3) metersUsed = heightM * (panelCount - 2)
      } else if (name.includes('tubo rectangular 30x60') || code === '30x60') {
        if (widthMm > 2000) metersUsed = widthM * 2
      } else if (name.includes('tubo rectangular 76x25') || code === '76x25') {
        if (widthMm > 3000) metersUsed = widthM
      }
    } else if (productTypeCode === 'abatible') {
      if (name.includes('marco hoja')) {
        metersUsed = 2 * (widthM + heightM) * panelCount
      } else if (name.includes('marco') && !name.includes('hoja') && !name.includes('pilar')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('junquillo')) {
        metersUsed = 2 * (widthM + heightM) * panelCount
      } else if (name.includes('amarre')) {
        metersUsed = panelCount * 0.5
      } else if (name.includes('pilar marco')) {
        metersUsed = heightM * (panelCount > 1 ? panelCount - 1 : 0)
      } else if (name.includes('tubo rectangular 30x60') || code === '30x60') {
        if (widthMm > 2000) metersUsed = widthM * 2
      } else if (name.includes('centro puerta')) {
        metersUsed = 2 * (widthM + heightM) * panelCount
      } else if (name.includes('pierna')) {
        metersUsed = heightM * 2
      } else if (name.includes('angulo')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('canal')) {
        metersUsed = 2 * (widthM + heightM)
      }
    } else if (productTypeCode === 'puerta') {
      if (name.includes('centro puerta')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('junquillo')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('tubo') && (name.includes('40x40') || name.includes('40x100') || name.includes('40x80') || name.includes('30x60'))) {
        if (name.includes('40x100') || name.includes('40x80')) {
          metersUsed = heightM * 2
        } else if (name.includes('40x40')) {
          metersUsed = (widthM + heightM) * 2
        } else {
          metersUsed = 2 * (widthM + heightM)
        }
      } else if (name.includes('placa aluminio')) {
        metersUsed = widthM
      } else if (name.includes('angulo')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('amarre')) {
        metersUsed = 4 * 0.3
      }
    } else if (productTypeCode === 'fijo') {
      if (name.includes('tubo rectangular')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('centro puerta')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('junquillo')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('placa aluminio')) {
        metersUsed = widthM
      } else if (name.includes('tubo') && !name.includes('rectangular')) {
        metersUsed = 2 * (widthM + heightM)
      }
    } else if (productTypeCode === 'celosia') {
      if (name.includes('marco') && !name.includes('pilar')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('junquillo')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('pilar marco')) {
        metersUsed = heightM * Math.max(1, Math.floor(widthM / 0.4))
      } else if (name.includes('tubo rectangular 30x60') || code === '30x60') {
        metersUsed = heightM * Math.max(1, Math.floor(widthM / 0.4))
      } else if (name.includes('tubo rectangular 76x25') || code === '76x25') {
        metersUsed = widthM * 2
      }
    } else if (productTypeCode === 'shower-door') {
      if (name.includes('riel inferior') || name.includes('riel superior')) {
        metersUsed = widthM
      } else if (name.includes('jamba') && !name.includes('esquinera')) {
        metersUsed = heightM * 2
      } else if (name.includes('bastidor')) {
        metersUsed = 2 * (widthM + heightM)
      } else if (name.includes('jamba esquinera')) {
        metersUsed = heightM
      }
    }

    if (metersUsed > 0) {
      usage.push({ profile, metersUsed })
    }
  }

  return usage
}

export function calculatePrice(input: PriceCalculationInput): PriceBreakdown {
  const {
    widthMm,
    heightMm,
    panelCount,
    quantity,
    productLineCode,
    productTypeCode,
    marginPct,
    marginPctCafe,
    colorCode,
    glassPricePerM2,
    profilePrices,
    accessoryPrices,
    laborCost,
    roundingMultiple,
  } = input

  const widthM = widthMm / 1000
  const heightM = heightMm / 1000

  let areaM2 = (widthMm * heightMm) / 1_000_000
  if (areaM2 < 0.5) areaM2 = 0.5

  const perimeterM = 2 * (widthM + heightM)

  const useCafePrice = colorCode !== 'natural'

  const profileUsage = getProfileUsage(widthMm, heightMm, panelCount, productTypeCode, productLineCode, profilePrices)
  let profilesTotal = 0
  for (const { profile, metersUsed } of profileUsage) {
    const pricePerStrip = useCafePrice ? profile.priceCafe : profile.priceNatural
    const pricePerMeter = pricePerStrip / profile.stripLengthM
    profilesTotal += metersUsed * pricePerMeter
  }

  const glassTotal = areaM2 * glassPricePerM2

  let accessoriesTotal = 0
  for (const acc of accessoryPrices) {
    let unitPrice = useCafePrice ? acc.priceCafe : acc.price
    let qty = acc.quantity

    if (acc.code === 'burlete') {
      qty = Math.ceil(perimeterM * panelCount)
      unitPrice = useCafePrice ? acc.priceCafe : acc.price
    } else if (acc.code === 'felpa') {
      qty = Math.ceil(perimeterM * 1.10 * panelCount)
      unitPrice = useCafePrice ? acc.priceCafe : acc.price
    }

    accessoriesTotal += qty * unitPrice
  }

  const laborTotal = laborCost
  const subtotal = profilesTotal + glassTotal + accessoriesTotal + laborTotal

  let marginMultiplier: number
  let marginAmount: number

  switch (colorCode) {
    case 'natural':
      marginMultiplier = 1 + marginPct / 100
      marginAmount = subtotal * (marginPct / 100)
      break
    case 'cafe':
      marginMultiplier = 1 + marginPctCafe / 100
      marginAmount = subtotal * (marginPctCafe / 100)
      break
    case 'titanio':
      marginAmount = subtotal * (marginPct / 100) + subtotal * (1 + marginPct / 100) * (10 / 100)
      marginMultiplier = (1 + marginPct / 100) * (1 + 10 / 100)
      break
    case 'blanco':
      marginAmount = subtotal * (marginPct / 100) + subtotal * (1 + marginPct / 100) * (10 / 100)
      marginMultiplier = (1 + marginPct / 100) * (1 + 10 / 100)
      break
    case 'madera':
      marginAmount = subtotal * (marginPct / 100) + subtotal * (1 + marginPct / 100) * (15 / 100)
      marginMultiplier = (1 + marginPct / 100) * (1 + 15 / 100)
      break
    case 'ral':
      marginAmount = subtotal * (marginPct / 100) + subtotal * (1 + marginPct / 100) * (20 / 100)
      marginMultiplier = (1 + marginPct / 100) * (1 + 20 / 100)
      break
    default:
      marginMultiplier = 1 + marginPct / 100
      marginAmount = subtotal * (marginPct / 100)
  }

  const rawTotal = subtotal * marginMultiplier
  const preTotal = Math.ceil(rawTotal / roundingMultiple) * roundingMultiple
  const total = preTotal * quantity
  const tax = total * 0.19
  const unitTotal = quantity > 0 ? total / quantity : 0

  return {
    areaM2: Math.round(areaM2 * 10000) / 10000,
    perimeterM: Math.round(perimeterM * 100) / 100,
    profilesTotal: Math.round(profilesTotal),
    glassTotal: Math.round(glassTotal),
    accessoriesTotal: Math.round(accessoriesTotal),
    laborTotal: Math.round(laborTotal),
    subtotal: Math.round(subtotal),
    marginAmount: Math.round(marginAmount),
    marginMultiplier: Math.round(marginMultiplier * 10000) / 10000,
    preTotal: Math.round(preTotal),
    tax: Math.round(tax),
    total: Math.round(total),
    unitTotal: Math.round(unitTotal),
  }
}

export function generateBreakdownRecords(
  breakdown: PriceBreakdown,
  input: PriceCalculationInput
): { concept: string; label: string; amount: number; percentage: number | null; sortOrder: number }[] {
  const records: { concept: string; label: string; amount: number; percentage: number | null; sortOrder: number }[] = []

  records.push({
    concept: 'profiles',
    label: `Perfiles de aluminio (${input.productLineCode})`,
    amount: breakdown.profilesTotal,
    percentage: null,
    sortOrder: 1,
  })

  records.push({
    concept: 'glass',
    label: `Vidrio (${breakdown.areaM2} m² × $${Math.round(input.glassPricePerM2).toLocaleString('es-CL')}/m²)`,
    amount: breakdown.glassTotal,
    percentage: null,
    sortOrder: 2,
  })

  if (breakdown.accessoriesTotal > 0) {
    records.push({
      concept: 'accessories',
      label: 'Accesorios',
      amount: breakdown.accessoriesTotal,
      percentage: null,
      sortOrder: 3,
    })
  }

  if (breakdown.laborTotal > 0) {
    records.push({
      concept: 'labor',
      label: 'Mano de obra',
      amount: breakdown.laborTotal,
      percentage: null,
      sortOrder: 4,
    })
  }

  records.push({
    concept: 'subtotal',
    label: 'Subtotal',
    amount: breakdown.subtotal,
    percentage: null,
    sortOrder: 5,
  })

  records.push({
    concept: 'margin',
    label: `Margen (${input.colorCode}: ×${breakdown.marginMultiplier.toFixed(4)})`,
    amount: breakdown.marginAmount,
    percentage: null,
    sortOrder: 6,
  })

  records.push({
    concept: 'pre_total',
    label: `Pre-total (redondeado a ${input.roundingMultiple})`,
    amount: breakdown.preTotal,
    percentage: null,
    sortOrder: 7,
  })

  if (input.quantity > 1) {
    records.push({
      concept: 'quantity',
      label: `Cantidad (×${input.quantity})`,
      amount: breakdown.total,
      percentage: null,
      sortOrder: 8,
    })
  }

  records.push({
    concept: 'tax',
    label: 'IVA (19%)',
    amount: breakdown.tax,
    percentage: 19,
    sortOrder: 9,
  })

  records.push({
    concept: 'total',
    label: `Total ${input.quantity > 1 ? `(${input.quantity} unidades)` : ''}`,
    amount: breakdown.total + breakdown.tax,
    percentage: null,
    sortOrder: 10,
  })

  return records
}
