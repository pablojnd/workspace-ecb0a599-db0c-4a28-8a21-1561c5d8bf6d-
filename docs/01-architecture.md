# Arquitectura — Crispieri Cotizador v2

## Stack

| Capa       | Tecnología                          |
| ---------- | ----------------------------------- |
| Frontend   | Vue 3 + Vite + Pinia + Vue Router  |
| Backend    | InsForge Edge Functions (Deno)      |
| Database   | PostgreSQL (InsForge)               |
| Auth       | InsForge Auth (opcional)            |
| Storage    | InsForge Storage (S3-compatible)    |
| Hosting    | InsForge Sites                      |

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────┐
│           Browser (Vue 3 SPA)           │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │ Cotizador │  │     Panel Admin      │ │
│  │  (8 pasos) │  │  (catalog + quotes)  │ │
│  └─────┬─────┘  └──────────┬───────────┘ │
│        └────────┬──────────┘             │
│                 │                        │
│         Pinia Store (quoteStore)         │
│         API Client (fetch + axios)       │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST
                  ▼
┌─────────────────────────────────────────┐
│         InsForge Edge Functions         │
│  ┌──────────┐  ┌────────┐  ┌────────┐  │
│  │  catalog  │  │ quotes │  │pricing │  │
│  │  (GET)    │  │ CRUD   │  │ (POST) │  │
│  └─────┬────┘  └───┬────┘  └───┬────┘  │
│        └─────┬─────┘───────────┘       │
│              │                          │
│         InsForge SDK (@insforge/sdk)    │
└──────────────┼──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      PostgreSQL (InsForge Managed)       │
│  ┌──────────────────────────────────┐   │
│  │  catalog: product_types, lines,  │   │
│  │  colors, glass, accessories,     │   │
│  │  profile_prices, pricing_rules   │   │
│  │  quotes, quote_items,            │   │
│  │  quote_item_accessories,         │   │
│  │  quote_item_breakdowns           │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Flujo de datos

1. **Carga inicial**: Vue fetches `GET /functions/v1/catalog` → almacena en Pinia
2. **Cotización**: Usuario configura producto → `POST /functions/v1/pricing` para estimación precisa
3. **Creación**: Usuario guarda → `POST /functions/v1/quotes` → Edge calcula precio y persiste
4. **Admin**: Panel consulta `GET /functions/v1/quotes` y `GET /functions/v1/catalog`

## Decisiones técnicas

- **Pricing en Edge Function**: La fórmula Crispieri corre en Deno para no exponer lógica sensible. El frontend tiene una versión simplificada para preview visual.
- **Sin autenticación inicial**: El cotizador es público. El panel admin se protege con clave básica o se añade auth después.
- **Pinia sobre Zustand**: Equivalente directo en Vue, misma filosofía de store único.
- **Componentes reutilizables**: Los UI components (shadcn/vue equivalentes) se comparten entre cotizador y admin.
