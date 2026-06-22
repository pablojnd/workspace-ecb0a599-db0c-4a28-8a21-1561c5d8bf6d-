import { corsHeaders } from './_shared/cors.ts'

const routes: Record<string, (req: Request) => Promise<Response>> = {
  catalog: (await import('./catalog/index.ts')).default,
  quotes: (await import('./quotes/index.ts')).default,
  pricing: (await import('./pricing/index.ts')).default,
}

async function routeRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const segments = url.pathname.replace(/^\/+/, '').split('/')
  const base = segments[0]

  const handler = routes[base]
  if (!handler) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return handler(req)
}

Deno.serve({ port: 8000 }, routeRequest)
