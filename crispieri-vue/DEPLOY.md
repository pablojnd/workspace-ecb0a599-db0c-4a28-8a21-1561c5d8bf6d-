# Deploy a Dokploy

## Requisitos

- Servidor con Dokploy instalado
- Docker y Docker Compose
- Acceso a terminal del servidor

## Opción 1: Deploy con Docker Compose (recomendado)

### 1. En Dokploy — Crear servicio Postgres

1. Ir a **Services → Add Service → Database**
2. Elegir **PostgreSQL 16**
3. Nombre: `crispieri-db`
4. Guardar credenciales (DB, user, password)

### 2. Clonar y configurar

```bash
git clone <tu-repo> crispieri
cd crispieri
cp .env.example .env
```

Editar `.env`:

```env
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
PORT=80
```

### 3. En Dokploy — Crear servicio Functions

1. **Services → Add Service → Docker Compose** (o **Dockerfile**)
2. Apuntar al repo y build context: `docker/functions.Dockerfile`
3. Variables de entorno: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
4. Puerto interno: `8000`
5. Conectar a la red de `crispieri-db`

### 4. En Dokploy — Crear servicio Frontend

1. **Services → Add Service → Dockerfile**
2. Build context raíz, Dockerfile: `docker/frontend.Dockerfile`
3. Variable de entorno: `VITE_INSFORGE_URL=/api`
4. Puerto expuesto: `80`

## Opción 2: Deploy completo con docker-compose.yml

Si Dokploy no tiene Postgres externo, usar el `docker-compose.yml`:

### En Dokploy

1. **Services → Add Service → Docker Compose**
2. Pegar el contenido de `docker-compose.yml`
3. Agregar variables de entorno globales
4. Hacer deploy

## Migraciones DB

Ejecutar migración inicial en la DB:

```bash
# Con psql
PGPASSWORD=<pass> psql -h <host> -U crispieri -d crispieri -f migrations/001_initial_schema.sql

# O desde Dokploy terminal
docker exec -i crispieri-db psql -U crispieri -d crispieri < migrations/001_initial_schema.sql
```

## Post-deploy: seed data

Insertar catálogo inicial (tipos de producto, líneas, colores, etc.) mediante API o SQL directo.

## DNS y dominio

En Dokploy, configurar dominio y SSL automático (Traefik) apuntando al frontend (puerto 80).
