import { corsHeaders } from '../_shared/cors.ts'
import { calculatePrice, generateBreakdownRecords } from '../_shared/pricing.ts'

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const input = await req.json()
    const breakdown = calculatePrice(input)
    const records = generateBreakdownRecords(breakdown, input)

    return new Response(JSON.stringify({ breakdown, records }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
}

if (import.meta.main) {
  Deno.serve(handler)
}
