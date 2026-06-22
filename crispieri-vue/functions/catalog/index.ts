import { supabase } from '../_shared/db.ts'
import { corsHeaders } from '../_shared/cors.ts'

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const [
      { data: productTypes },
      { data: productLines },
      { data: productTypeLines },
      { data: colors },
      { data: productLineColors },
      { data: glassOptions },
      { data: productLineGlass },
      { data: accessories },
      { data: productLineAccessories },
      { data: profilePrices },
      { data: pricingRules },
    ] = await Promise.all([
      supabase.from('product_types').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('product_lines').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('product_type_lines').select('*').eq('is_active', true),
      supabase.from('colors').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('product_line_colors').select('*').eq('is_active', true),
      supabase.from('glass_options').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('product_line_glass').select('*').eq('is_active', true),
      supabase.from('accessories').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('product_line_accessories').select('*').eq('is_active', true),
      supabase.from('profile_prices').select('*').eq('is_active', true).order('product_line_id').order('sort_order'),
      supabase.from('pricing_rules').select('*').eq('is_active', true),
    ])

    const catalog = {
      productTypes: productTypes ?? [],
      productLines: productLines ?? [],
      productTypeLines: productTypeLines ?? [],
      colors: colors ?? [],
      productLineColors: productLineColors ?? [],
      glassOptions: glassOptions ?? [],
      productLineGlass: productLineGlass ?? [],
      accessories: accessories ?? [],
      productLineAccessories: productLineAccessories ?? [],
      profilePrices: profilePrices ?? [],
      pricingRules: pricingRules ?? [],
    }

    return new Response(JSON.stringify(catalog), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
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
