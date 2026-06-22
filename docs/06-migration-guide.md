# Guía de Migración — Next.js → Vue + InsForge

## Prerrequisitos

- Node.js 20+
- InsForge CLI: `npx @insforge/cli login`
- Cuenta en InsForge

## Paso 1: Configurar InsForge

```bash
# Login
npx @insforge/cli login

# Crear proyecto
npx @insforge/cli projects create crispieri-cotizador

# Link directorio local
cd crispieri-vue
npx @insforge/cli link

# Verificar
npx @insforge/cli current
```

## Paso 2: Migrar Base de Datos

```bash
# Aplicar migración SQL
npx @insforge/cli db execute --file migrations/001_initial_schema.sql

# Sembrar datos de catálogo
npx @insforge/cli db execute --file migrations/002_seed_data.sql
```

Los archivos SQL están en `migrations/`.

## Paso 3: Desplegar Edge Functions

```bash
# Desplegar todas las funciones
npx @insforge/cli functions deploy functions/catalog
npx @insforge/cli functions deploy functions/quotes
npx @insforge/cli functions deploy functions/pricing

# Verificar
npx @insforge/cli functions list
```

## Paso 4: Configurar Frontend

```bash
cd frontend
npm install

# Copiar .env.example a .env.local
# Editar con la URL del proyecto InsForge
```

```
VITE_INSFORGE_URL=https://<project>.insforge.dev/functions/v1
```

## Paso 5: Desplegar Frontend

```bash
cd frontend
npm run build

# Desplegar a InsForge Sites
npx @insforge/cli sites deploy --dir dist
```

## Comandos de Desarrollo

```bash
# Frontend (dev local)
cd frontend && npm run dev

# Edge Functions (local)
npx @insforge/cli functions serve functions/catalog

# Todo (usando script)
./scripts/dev.sh
```
