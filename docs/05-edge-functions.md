# Edge Functions — InsForge (Deno)

## Estructura

```
functions/
├── _shared/
│   ├── cors.ts          # Headers CORS
│   ├── db.ts            # Conexión a PostgreSQL
│   └── pricing.ts       # Lógica de pricing Crispieri (compartida)
├── catalog/
│   └── index.ts         # GET /catalog
├── quotes/
│   └── index.ts         # CRUD /quotes
└── pricing/
    └── index.ts         # POST /pricing
```

## _shared/pricing.ts

Lógica completa de pricing Crispieri migrada de `src/lib/pricing.ts`.

- Función `calculatePrice(input)`: calcula precios de perfiles, vidrio, accesorios, mano de obra, márgenes, redondeo e IVA.
- Función `getProfileUsage(...)`: determina qué perfiles usar según tipo de producto.
- No dependencias externas — TypeScript puro, compatible con Deno.

## _shared/db.ts

```ts
import { createClient } from 'jsr:@supabase/supabase-js'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
export const supabase = createClient(supabaseUrl, supabaseKey)
```

## catalog/index.ts

```ts
import { supabase } from '../_shared/db.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const [productTypes, productLines, productTypeLines, colors, productLineColors,
         glassOptions, productLineGlass, accessories, productLineAccessories,
         profilePrices, pricingRules] = await Promise.all([
    supabase.from('product_types').select('*').eq('is_active', true).order('sort_order'),
    // ... etc
  ])

  return new Response(JSON.stringify({ productTypes: productTypes.data, ... }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
```

## quotes/index.ts

Maneja todas las operaciones CRUD de quotes usando `supabase` client.
- `GET` → listar con paginación
- `POST` → crear con items, calcular pricing, insertar breakdowns
- `GET /:id` → detalle con joins
- `PUT /:id` → actualizar
- `DELETE /:id` → eliminar
- `PUT /:id/status` → cambiar estado
- `POST /:id/duplicate` → duplicar

## pricing/index.ts

```ts
import { corsHeaders } from '../_shared/cors.ts'
import { calculatePrice, generateBreakdownRecords } from '../_shared/pricing.ts'

Deno.serve(async (req) => {
  const input = await req.json()
  const breakdown = calculatePrice(input)
  const records = generateBreakdownRecords(breakdown, input)
  return new Response(JSON.stringify({ breakdown, records }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
```
