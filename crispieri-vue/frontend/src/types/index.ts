export interface ProductType {
  id: string
  name: string
  code: string
  description: string | null
  icon: string | null
  isActive: boolean
  sortOrder: number
}

export interface ProductLine {
  id: string
  name: string
  code: string
  description: string | null
  marginPct: number
  marginPctCafe: number
  isActive: boolean
  sortOrder: number
}

export interface Color {
  id: string
  name: string
  code: string
  hexValue: string | null
  surchargePct: number
  isRAL: boolean
  isActive: boolean
  sortOrder: number
}

export interface GlassOption {
  id: string
  name: string
  code: string
  description: string | null
  isActive: boolean
  sortOrder: number
}

export interface Accessory {
  id: string
  name: string
  code: string
  description: string | null
  price: number
  priceCafe: number
  unit: string
  isActive: boolean
  sortOrder: number
}

export interface ProfilePrice {
  id: string
  productLineId: string
  profileName: string
  profileCode: string
  priceNatural: number
  priceCafe: number
  stripLengthM: number
  isActive: boolean
  sortOrder: number
}

export interface PricingRule {
  id: string
  productLineId: string
  name: string
  ruleType: string
  value: number
  unit: string | null
  minPanels: number | null
  maxPanels: number | null
  isActive: boolean
}

export interface ProductLineGlass {
  id: string
  productLineId: string
  glassOptionId: string
  pricePerM2: number
  isActive: boolean
}

export interface ProductLineColor {
  id: string
  productLineId: string
  colorId: string
  isActive: boolean
}

export interface ProductLineAccessory {
  id: string
  productLineId: string
  accessoryId: string
  isActive: boolean
}

export interface ProductTypeLine {
  id: string
  productTypeId: string
  productLineId: string
  isActive: boolean
}

export interface CatalogData {
  productTypes: ProductType[]
  productLines: ProductLine[]
  productTypeLines: ProductTypeLine[]
  colors: Color[]
  productLineColors: ProductLineColor[]
  glassOptions: GlassOption[]
  productLineGlass: ProductLineGlass[]
  accessories: Accessory[]
  productLineAccessories: ProductLineAccessory[]
  profilePrices: ProfilePrice[]
  pricingRules: PricingRule[]
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

export interface QuoteItemInput {
  productTypeId: string
  productLineId: string
  glassOptionId: string
  colorId?: string
  widthMm: number
  heightMm: number
  panelCount: number
  quantity: number
  observations?: string
  accessories: { accessoryId: string; quantity: number }[]
}

export interface CreateQuoteInput {
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  notes?: string
  items: QuoteItemInput[]
}

export interface QuoteResponse {
  id: string
  quoteNumber: string
  status: string
  clientName: string | null
  clientEmail: string | null
  clientPhone: string | null
  notes: string | null
  totalSubtotal: number
  totalTax: number
  totalAmount: number
  currency: string
  expiresAt: string | null
  createdAt: string
  items: QuoteItemResponse[]
}

export interface QuoteItemResponse {
  id: string
  productTypeId: string
  productLineId: string
  glassOptionId: string
  colorId: string | null
  widthMm: number
  heightMm: number
  panelCount: number
  quantity: number
  observations: string | null
  profilesTotal: number
  glassTotal: number
  accessoriesTotal: number
  laborTotal: number
  subtotal: number
  marginAmount: number
  preTotal: number
  tax: number
  total: number
  productType: ProductType
  productLine: ProductLine
  glassOption: GlassOption
  color: Color | null
  accessories: QuoteItemAccessoryResponse[]
  priceBreakdowns: QuoteItemBreakdownResponse[]
}

export interface QuoteItemAccessoryResponse {
  id: string
  accessoryId: string
  accessory: Accessory
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface QuoteItemBreakdownResponse {
  id: string
  concept: string
  label: string
  amount: number
  percentage: number | null
  sortOrder: number
}
