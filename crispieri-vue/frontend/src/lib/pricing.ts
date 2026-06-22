import type { ProfilePrice, PriceBreakdown } from '@/types'

export function estimatePrice(params: {
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
  accessoryPrices: { price: number; priceCafe: number; code: string; quantity: number }[]
  profilePrices?: ProfilePrice[]
  laborCost?: number
  roundingMultiple?: number
}): PriceBreakdown {
  const {
    widthMm, heightMm, panelCount, quantity, marginPct, marginPctCafe,
    colorCode, glassPricePerM2, accessoryPrices, profilePrices,
    laborCost = 20000, roundingMultiple = 1000,
  } = params

  const widthM = widthMm / 1000
  const heightM = heightMm / 1000
  let areaM2 = (widthMm * heightMm) / 1_000_000
  if (areaM2 < 0.5) areaM2 = 0.5
  const perimeterM = 2 * (widthM + heightM)
  const useCafePrice = colorCode !== 'natural'

  let profilesTotal = 0
  if (profilePrices && profilePrices.length > 0) {
    for (const pp of profilePrices) {
      const pricePerM = (useCafePrice ? pp.priceCafe : pp.priceNatural) / pp.stripLengthM
      const name = pp.profileName.toLowerCase()
      let meters = 0

      if (name.includes('riel inferior') || name.includes('riel superior')) {
        meters = widthM * panelCount
      } else if (name.includes('jamba') && !name.includes('esquinera')) {
        meters = heightM * 2
      } else if (name.includes('cabecera inferior') || name.includes('cabecera superior')) {
        meters = widthM
      } else if (name.includes('traslapo')) {
        meters = heightM * Math.max(0, panelCount - 1)
      } else if (name.includes('pierna')) {
        meters = heightM * panelCount
      } else if (name.includes('palillo')) {
        meters = heightM * panelCount
      } else if (name.includes('tubo rectangular')) {
        meters = 2 * (widthM + heightM)
      } else if (name.includes('tubo') && !name.includes('rectangular')) {
        meters = 2 * (widthM + heightM)
      } else if (name.includes('centro puerta')) {
        meters = 2 * (widthM + heightM)
      } else if (name.includes('junquillo')) {
        meters = 2 * (widthM + heightM)
      } else if (name.includes('placa')) {
        meters = widthM
      } else if (name.includes('marco')) {
        meters = 2 * (widthM + heightM)
      } else if (name.includes('bastidor')) {
        meters = 2 * (widthM + heightM)
      } else if (name.includes('pilar')) {
        meters = heightM * panelCount
      } else if (name.includes('amarre') || name.includes('angulo') || name.includes('canal')) {
        meters = (widthM + heightM) * 0.5
      }

      profilesTotal += meters * pricePerM
    }
  } else {
    const avgCost = ((useCafePrice ? 12000 : 10000) / 6)
    profilesTotal = perimeterM * avgCost * 2.5
  }

  const glassTotal = areaM2 * glassPricePerM2

  let accessoriesTotal = 0
  for (const acc of accessoryPrices) {
    let unitPrice = useCafePrice ? acc.priceCafe : acc.price
    let qty = acc.quantity
    if (acc.code === 'burlete') {
      qty = Math.ceil(perimeterM * panelCount)
    } else if (acc.code === 'felpa') {
      qty = Math.ceil(perimeterM * 1.10 * panelCount)
    }
    accessoriesTotal += qty * unitPrice
  }

  const laborTotal = laborCost
  const subtotal = profilesTotal + glassTotal + accessoriesTotal + laborTotal

  let marginMultiplier: number
  switch (colorCode) {
    case 'natural': marginMultiplier = 1 + marginPct / 100; break
    case 'cafe': marginMultiplier = 1 + marginPctCafe / 100; break
    case 'titanio': marginMultiplier = (1 + marginPct / 100) * 1.10; break
    case 'blanco': marginMultiplier = (1 + marginPct / 100) * 1.10; break
    case 'madera': marginMultiplier = (1 + marginPct / 100) * 1.15; break
    case 'ral': marginMultiplier = (1 + marginPct / 100) * 1.20; break
    default: marginMultiplier = 1 + marginPct / 100
  }

  const preTotal = Math.ceil(subtotal * marginMultiplier / roundingMultiple) * roundingMultiple
  const total = preTotal * quantity
  const tax = total * 0.19

  return {
    areaM2: Math.round(areaM2 * 10000) / 10000,
    perimeterM: Math.round(perimeterM * 100) / 100,
    profilesTotal: Math.round(profilesTotal),
    glassTotal: Math.round(glassTotal),
    accessoriesTotal: Math.round(accessoriesTotal),
    laborTotal: Math.round(laborTotal),
    subtotal: Math.round(subtotal),
    marginAmount: Math.round(subtotal * marginMultiplier - subtotal),
    marginMultiplier: Math.round(marginMultiplier * 10000) / 10000,
    preTotal: Math.round(preTotal),
    tax: Math.round(tax),
    total: Math.round(total),
    unitTotal: Math.round(total / quantity),
  }
}
