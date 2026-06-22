import { supabase } from '../_shared/db.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { calculatePrice, generateBreakdownRecords } from '../_shared/pricing.ts'

async function getCatalogHelpers() {
  const [
    { data: productTypes },
    { data: productLines },
    { data: colors },
    { data: glassOptions },
    { data: accessories },
    { data: profilePricesList },
    { data: pricingRulesList },
  ] = await Promise.all([
    supabase.from('product_types').select('id, name, code, description, icon'),
    supabase.from('product_lines').select('id, name, code, description, margin_pct, margin_pct_cafe'),
    supabase.from('colors').select('id, name, code, hex_value, surcharge_pct, is_ral'),
    supabase.from('glass_options').select('id, name, code, description'),
    supabase.from('accessories').select('id, name, code, price, price_cafe, unit'),
    supabase.from('profile_prices').select('*').eq('is_active', true),
    supabase.from('pricing_rules').select('*').eq('is_active', true),
  ])

  return {
    productTypes: productTypes ?? [],
    productLines: productLines ?? [],
    colors: colors ?? [],
    glassOptions: glassOptions ?? [],
    accessories: accessories ?? [],
    profilePricesList: profilePricesList ?? [],
    pricingRulesList: pricingRulesList ?? [],
  }
}

function generateQuoteNumber(index: number): string {
  const pad = String(index + 1).padStart(4, '0')
  return `COT-${pad}`
}

async function handleGet(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  // GET /quotes/:id
  if (id && id !== 'quotes') {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        items:quote_items(
          *,
          product_type:product_types(id, name, code),
          product_line:product_lines(id, name, code),
          glass_option:glass_options(id, name, code),
          color:colors(id, name, code, hex_value),
          accessories:quote_item_accessories(*, accessory:accessories(*)),
          price_breakdowns:quote_item_breakdowns(*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // GET /quotes (list)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '20'))
  const status = url.searchParams.get('status')
  const skip = (page - 1) * limit

  let query = supabase.from('quotes').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data, count, error } = await query.range(skip, skip + limit - 1)
  if (error) throw error

  return new Response(JSON.stringify({
    quotes: data,
    pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) },
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handlePost(req: Request) {
  const body = await req.json()
  const { clientName, clientEmail, clientPhone, notes, items } = body

  if (!items || !items.length) {
    return new Response(JSON.stringify({ error: 'At least one item is required' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Get helpers for pricing
  const helpers = await getCatalogHelpers()

  // Generate quote number
  const { count } = await supabase.from('quotes').select('*', { count: 'exact', head: true })
  const quoteNumber = generateQuoteNumber(count ?? 0)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  // Create quote
  const { data: quote, error: quoteError } = await supabase.from('quotes').insert({
    quote_number: quoteNumber,
    status: 'draft',
    client_name: clientName || null,
    client_email: clientEmail || null,
    client_phone: clientPhone || null,
    notes: notes || null,
    expires_at: expiresAt.toISOString(),
    total_subtotal: 0,
    total_tax: 0,
    total_amount: 0,
  }).select().single()

  if (quoteError) throw quoteError

  let totalSubtotal = 0
  let totalTax = 0
  let totalAmount = 0

  for (const item of items) {
    const productLine = helpers.productLines.find((pl: any) => pl.id === item.productLineId)
    const productType = helpers.productTypes.find((pt: any) => pt.id === item.productTypeId)
    const color = helpers.colors.find((c: any) => c.id === item.colorId)

    if (!productLine || !productType) {
      throw new Error('Product line or type not found')
    }

    const colorCode = color?.code || 'natural'

    // Get glass price
    const { data: plg } = await supabase.from('product_line_glass')
      .select('price_per_m2')
      .eq('product_line_id', item.productLineId)
      .eq('glass_option_id', item.glassOptionId)
      .single()

    const glassPricePerM2 = plg?.price_per_m2 ?? 0

    // Get profile prices for this line
    const lineProfiles = helpers.profilePricesList.filter((pp: any) => pp.product_line_id === item.productLineId)

    // Get pricing rules
    const lineRules = helpers.pricingRulesList.filter((pr: any) => pr.product_line_id === item.productLineId)
    const roundingRule = lineRules.find((r: any) => r.rule_type === 'rounding_multiple')
    const roundingMultiple = roundingRule?.value ?? 1000
    const laborRule = lineRules.find((r: any) => r.rule_type === 'labor_cost')
    const laborCost = laborRule?.value ?? 20000

    // Get accessories with prices
    const accessoryPrices = []
    for (const acc of item.accessories || []) {
      const accessory = helpers.accessories.find((a: any) => a.id === acc.accessoryId)
      if (accessory) {
        accessoryPrices.push({
          name: accessory.name,
          code: accessory.code,
          price: accessory.price,
          priceCafe: accessory.price_cafe,
          unit: accessory.unit,
          quantity: acc.quantity,
        })
      }
    }

    const breakdown = calculatePrice({
      widthMm: item.widthMm,
      heightMm: item.heightMm,
      panelCount: item.panelCount || 1,
      quantity: item.quantity || 1,
      productLineCode: productLine.code,
      productTypeCode: productType.code,
      marginPct: productLine.margin_pct,
      marginPctCafe: productLine.margin_pct_cafe,
      colorCode,
      glassPricePerM2,
      profilePrices: lineProfiles.map((pp: any) => ({
        profileName: pp.profile_name,
        profileCode: pp.profile_code,
        priceNatural: pp.price_natural,
        priceCafe: pp.price_cafe,
        stripLengthM: pp.strip_length_m,
      })),
      accessoryPrices,
      laborCost,
      roundingMultiple,
    })

    // Insert quote item
    const { data: quoteItem, error: itemError } = await supabase.from('quote_items').insert({
      quote_id: quote.id,
      product_type_id: item.productTypeId,
      product_line_id: item.productLineId,
      glass_option_id: item.glassOptionId,
      color_id: item.colorId || null,
      width_mm: item.widthMm,
      height_mm: item.heightMm,
      panel_count: item.panelCount || 1,
      quantity: item.quantity || 1,
      observations: item.observations || null,
      profiles_total: breakdown.profilesTotal,
      glass_total: breakdown.glassTotal,
      accessories_total: breakdown.accessoriesTotal,
      labor_total: breakdown.laborTotal,
      subtotal: breakdown.subtotal,
      margin_amount: breakdown.marginAmount,
      pre_total: breakdown.preTotal,
      tax: breakdown.tax,
      total: breakdown.total,
    }).select().single()

    if (itemError) throw itemError

    // Insert accessories
    for (const acc of item.accessories || []) {
      const accessory = helpers.accessories.find((a: any) => a.id === acc.accessoryId)
      if (accessory) {
        const useCafePrice = colorCode !== 'natural'
        const unitPrice = useCafePrice ? accessory.price_cafe : accessory.price
        await supabase.from('quote_item_accessories').insert({
          quote_item_id: quoteItem.id,
          accessory_id: acc.accessoryId,
          quantity: acc.quantity,
          unit_price: unitPrice,
          total_price: unitPrice * acc.quantity,
        })
      }
    }

    // Insert breakdown records
    const records = generateBreakdownRecords(breakdown, {
      widthMm: item.widthMm,
      heightMm: item.heightMm,
      panelCount: item.panelCount || 1,
      quantity: item.quantity || 1,
      productLineCode: productLine.code,
      productTypeCode: productType.code,
      marginPct: productLine.margin_pct,
      marginPctCafe: productLine.margin_pct_cafe,
      colorCode,
      glassPricePerM2,
      profilePrices: lineProfiles.map((pp: any) => ({
        profileName: pp.profile_name,
        profileCode: pp.profile_code,
        priceNatural: pp.price_natural,
        priceCafe: pp.price_cafe,
        stripLengthM: pp.strip_length_m,
      })),
      accessoryPrices,
      laborCost,
      roundingMultiple,
    })

    for (const record of records) {
      await supabase.from('quote_item_breakdowns').insert({
        quote_item_id: quoteItem.id,
        concept: record.concept,
        label: record.label,
        amount: record.amount,
        percentage: record.percentage,
        sort_order: record.sortOrder,
      })
    }

    totalSubtotal += breakdown.subtotal
    totalTax += breakdown.tax
    totalAmount += breakdown.total
  }

  // Update quote totals
  const { data: updatedQuote } = await supabase.from('quotes').update({
    total_subtotal: Math.round(totalSubtotal),
    total_tax: Math.round(totalTax),
    total_amount: Math.round(totalAmount),
  }).eq('id', quote.id).select(`
    *,
    items:quote_items(
      *,
      product_type:product_types(id, name, code),
      product_line:product_lines(id, name, code),
      glass_option:glass_options(id, name, code),
      color:colors(id, name, code, hex_value),
      accessories:quote_item_accessories(*, accessory:accessories(*)),
      price_breakdowns:quote_item_breakdowns(*)
    )
  `).single()

  return new Response(JSON.stringify(updatedQuote), {
    status: 201,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handlePut(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  if (url.pathname.endsWith('/status') && id) {
    const { status: newStatus } = await req.json()
    const { data, error } = await supabase.from('quotes')
      .update({ status: newStatus })
      .eq('id', id)
      .select().single()

    if (error) throw error
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const body = await req.json()
  const { data, error } = await supabase.from('quotes')
    .update(body)
    .eq('id', id)

  if (error) throw error
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleDelete(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  const { error } = await supabase.from('quotes').delete().eq('id', id)
  if (error) throw error

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function handleDuplicate(req: Request) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').filter(s => s).filter(s => s !== 'duplicate').pop()

  // Fetch original quote with items
  const { data: original } = await supabase.from('quotes')
    .select('*, items:quote_items(*)')
    .eq('id', id)
    .single()

  if (!original) throw new Error('Quote not found')

  // Create duplicate via POST
  const duplicatedReq = new Request(req.url, {
    method: 'POST',
    body: JSON.stringify({
      clientName: original.client_name,
      clientEmail: original.client_email,
      clientPhone: original.client_phone,
      notes: `DUPLICADO DE ${original.quote_number}: ${original.notes || ''}`,
      items: original.items.map((item: any) => ({
        productTypeId: item.product_type_id,
        productLineId: item.product_line_id,
        glassOptionId: item.glass_option_id,
        colorId: item.color_id,
        widthMm: item.width_mm,
        heightMm: item.height_mm,
        panelCount: item.panel_count,
        quantity: item.quantity,
        observations: item.observations,
        accessories: [],
      })),
    }),
  })

  return handlePost(duplicatedReq)
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const isDuplicate = url.pathname.endsWith('/duplicate')

    switch (req.method) {
      case 'GET':
        return await handleGet(req)
      case 'POST':
        if (isDuplicate) return await handleDuplicate(req)
        return await handlePost(req)
      case 'PUT':
        return await handlePut(req)
      case 'DELETE':
        return await handleDelete(req)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

if (import.meta.main) {
  Deno.serve(handler)
}
