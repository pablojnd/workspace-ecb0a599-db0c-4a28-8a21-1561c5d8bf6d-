# Crispieri Cotizador

Sistema de cotización online para Crispieri. Migrado de Next.js a **Vue 3 + Vite + InsForge** (Postgres + Edge Functions).

## Stack

- **Frontend:** Vue 3, Vite, Pinia, Vue Router, Tailwind CSS v4
- **Backend:** InsForge (Postgres + Deno Edge Functions)
- **Runtime:** Bun

## Estructura

```
crispieri-vue/
├── frontend/          # Vue 3 SPA
│   └── src/
│       ├── types/         # TypeScript interfaces
│       ├── lib/           # API client, pricing lógica
│       ├── stores/        # Pinia stores
│       ├── router/        # Vue Router config
│       ├── components/    # Cotizador step components
│       ├── views/         # Pages (cotizador, admin)
│       └── assets/        # CSS global
├── functions/         # Deno Edge Functions
│   ├── _shared/          # CORS, DB, pricing
│   ├── catalog/          # Product catalog API
│   ├── quotes/           # Quotes CRUD
│   └── pricing/          # Price calculation API
└── migrations/        # PostgreSQL migrations
```

## Requisitos

- [Bun](https://bun.sh) >= 1.0
- Node.js >= 18
- Acceso a InsForge (Supabase)

## Setup

```bash
# 1. Instalar dependencias del frontend
cd crispieri-vue/frontend
bun install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con la URL de InsForge

# 3. Aplicar migraciones
# Ejecutar migrations/001_initial_schema.sql en la DB de InsForge

# 4. Desplegar Edge Functions
# Usar el CLI de Supabase/InsForge para deployar functions/

# 5. Iniciar desarrollo
./scripts/dev.sh     # Linux/Mac
./scripts/dev.ps1    # Windows
```

## Desarrollo

```bash
# Frontend solo
cd crispieri-vue/frontend
bun run dev       # http://localhost:5173

# Edge Functions local
cd crispieri-vue
supabase functions serve  # http://localhost:54321
```

## Rutas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | Cotizador | Cotizador público 8 pasos |
| `/admin` | Dashboard | Listado de cotizaciones |
| `/admin/quote/:id` | Detalle | Ver/editar cotización |
| `/admin/catalog` | Catálogo | Ver productos, líneas, colores |

## Documentación

Ver [docs/](docs/) para arquitectura, API, DB schema y guía de migración.
