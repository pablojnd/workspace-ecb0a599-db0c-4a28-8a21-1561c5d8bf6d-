# Frontend — Componentes y Vistas

## Estructura de archivos

```
frontend/src/
├── main.ts                      # Entry point
├── App.vue                      # Root component with router-view
├── router/
│   └── index.ts                 # Routes definition
├── stores/
│   └── quoteStore.ts            # Pinia store (configuración + catálogo)
├── lib/
│   ├── api.ts                   # API client (fetch a Edge Functions)
│   ├── pricing.ts               # Client-side price estimation (simplificada)
│   └── utils.ts                 # Formatos, helpers
├── types/
│   └── index.ts                 # TypeScript interfaces
├── components/
│   ├── cotizador/               # Componentes del cotizador (8 pasos)
│   │   ├── AppHeader.vue
│   │   ├── ProductTypeSelector.vue
│   │   ├── LineSelector.vue
│   │   ├── DimensionInputs.vue
│   │   ├── ColorSelector.vue
│   │   ├── GlassSelector.vue
│   │   ├── AccessoriesSelector.vue
│   │   ├── QuantityNotes.vue
│   │   ├── ReviewStep.vue
│   │   ├── QuoteSummary.vue
│   │   └── WindowPreview.vue
│   └── ui/                      # UI primitives (botones, inputs, etc.)
│       ├── Button.vue
│       ├── Card.vue
│       ├── Select.vue
│       ├── Input.vue
│       └── Badge.vue
├── views/
│   ├── public/
│   │   └── CotizadorView.vue    # Página principal del cotizador
│   └── admin/
│       ├── DashboardView.vue    # Listado de cotizaciones
│       ├── QuoteDetailView.vue  # Detalle de cotización
│       └── CatalogView.vue      # Gestión de catálogo
└── assets/
    └── main.css                 # Estilos globales (Tailwind)
```

## Router

```ts
const routes = [
  { path: '/', name: 'cotizador', component: CotizadorView },
  { path: '/admin', name: 'dashboard', component: DashboardView },
  { path: '/admin/quote/:id', name: 'quote-detail', component: QuoteDetailView },
  { path: '/admin/catalog', name: 'catalog', component: CatalogView },
]
```

## Store (Pinia)

`useQuoteStore` maneja:
- **Catalog**: carga y cache del catálogo
- **Config**: producto, línea, dimensiones, color, vidrio, accesorios, cantidad
- **Price**: estimación local (simplificada)
- **Submit**: creación de cotización vía API

Equivalente directo del Zustand store actual.

## Flujo del Cotizador (8 pasos)

| Paso | Componente           | Descripción                         |
|------|----------------------|-------------------------------------|
| 1    | ProductTypeSelector  | Seleccionar tipo (corredera, fijo…) |
| 2    | LineSelector         | Seleccionar línea/serie             |
| 3    | DimensionInputs      | Ancho, alto, paños                  |
| 4    | ColorSelector        | Color del perfil                    |
| 5    | GlassSelector        | Tipo de vidrio                      |
| 6    | AccessoriesSelector  | Accesorios opcionales               |
| 7    | QuantityNotes        | Cantidad y observaciones            |
| 8    | ReviewStep           | Resumen + precio estimado           |
