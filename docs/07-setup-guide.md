# Guía de Setup — Crispieri Cotizador v2

## Requisitos

- Node.js >= 20
- npm >= 9
- InsForge CLI (`npx @insforge/cli login`)
- Cuenta InsForge (https://insforge.dev)

## Instalación

```bash
# Clonar o copiar el proyecto
cd crispieri-vue

# Instalar dependencias del frontend
cd frontend && npm install

# Volver a raíz
cd ..
```

## Configuración

### 1. InsForge

```bash
npx @insforge/cli login
npx @insforge/cli projects create crispieri-cotizador
npx @insforge/cli link
```

### 2. Base de datos

```bash
npx @insforge/cli db create
npx @insforge/cli db execute --file migrations/001_initial_schema.sql
npx @insforge/cli db execute --file migrations/002_seed_data.sql
```

### 3. Variables de entorno

```bash
cp frontend/.env.example frontend/.env.local
```

Editar `frontend/.env.local`:

```
VITE_INSFORGE_URL=https://<tu-proyecto>.insforge.dev/functions/v1
```

### 4. Desplegar Edge Functions

```bash
npx @insforge/cli functions deploy functions/catalog
npx @insforge/cli functions deploy functions/quotes
npx @insforge/cli functions deploy functions/pricing
```

### 5. Frontend

```bash
cd frontend
npm run dev     # Desarrollo local
npm run build   # Producción
```

### 6. Deploy final

```bash
npx @insforge/cli sites deploy --dir frontend/dist
```

## Desarrollo local

```bash
# Terminal 1: Edge Functions local
npx @insforge/cli functions serve

# Terminal 2: Frontend
cd frontend && npm run dev
```

## Estructura final del proyecto

```
crispieri-vue/
├── frontend/          # Vue 3 + Vite
│   ├── src/           # Código fuente
│   ├── public/        # Assets estáticos
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tailwind.config.js
├── functions/         # InsForge Edge Functions
│   ├── _shared/       # Código compartido
│   ├── catalog/
│   ├── quotes/
│   └── pricing/
├── migrations/        # SQL migrations
├── scripts/           # Scripts de desarrollo
├── docs/              # Documentación
└── README.md
```
