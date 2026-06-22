# Base de Datos — Esquema PostgreSQL

> Migrado del schema Prisma/SQLite original. Usa naming `snake_case` para Postgres.

## Tablas de Catálogo

### product_types

| Columna      | Tipo         | Descripción                      |
|-------------|-------------|----------------------------------|
| id          | UUID (PK)   | `gen_random_uuid()`              |
| name        | TEXT (UNIQUE)| "Ventana Corredera"             |
| code        | TEXT (UNIQUE)| "corredera"                     |
| description | TEXT         | Descripción                      |
| icon        | TEXT         | Nombre del ícono                 |
| is_active   | BOOLEAN      | DEFAULT true                     |
| sort_order  | INTEGER      | DEFAULT 0                        |
| created_at  | TIMESTAMPTZ  | DEFAULT now()                    |
| updated_at  | TIMESTAMPTZ  | DEFAULT now()                    |

### product_lines

| Columna       | Tipo         | Descripción                     |
|--------------|-------------|----------------------------------|
| id           | UUID (PK)   |                                  |
| name         | TEXT (UNIQUE)| "Línea 5000"                   |
| code         | TEXT (UNIQUE)| "linea-5000"                   |
| description  | TEXT         |                                  |
| margin_pct   | REAL         | Margen % color natural          |
| margin_pct_cafe | REAL     | Margen % color café             |
| is_active    | BOOLEAN      | DEFAULT true                     |
| sort_order   | INTEGER      | DEFAULT 0                        |

### product_type_lines (M:N)

| Columna        | Tipo       | Ref                       |
|---------------|-----------|---------------------------|
| id            | UUID (PK) |                           |
| product_type_id | UUID    | → product_types(id)      |
| product_line_id | UUID    | → product_lines(id)      |
| is_active     | BOOLEAN    | DEFAULT true               |

### colors

| Columna       | Tipo         | Descripción                |
|--------------|-------------|----------------------------|
| id           | UUID (PK)   |                            |
| name         | TEXT (UNIQUE)| "Natural"                 |
| code         | TEXT (UNIQUE)| "natural"                 |
| hex_value    | TEXT         | "#C0C0C0"                  |
| surcharge_pct| REAL         | 0-20                       |
| is_ral       | BOOLEAN      | DEFAULT false              |
| is_active    | BOOLEAN      | DEFAULT true               |
| sort_order   | INTEGER      | DEFAULT 0                  |

### product_line_colors (M:N)

| Columna        | Tipo       | Ref                       |
|---------------|-----------|---------------------------|
| id            | UUID (PK) |                           |
| product_line_id | UUID    | → product_lines(id)      |
| color_id      | UUID       | → colors(id)              |
| is_active     | BOOLEAN    | DEFAULT true               |

### glass_options

| Columna      | Tipo         | Descripción                |
|-------------|-------------|----------------------------|
| id          | UUID (PK)   |                            |
| name        | TEXT (UNIQUE)| "Doble Incoloro"          |
| code        | TEXT (UNIQUE)| "doble-inc"               |
| description | TEXT         |                            |
| is_active   | BOOLEAN      | DEFAULT true               |
| sort_order  | INTEGER      | DEFAULT 0                  |

### product_line_glass

| Columna         | Tipo   | Ref                       |
|----------------|--------|---------------------------|
| id             | UUID   |                           |
| product_line_id | UUID  | → product_lines(id)      |
| glass_option_id | UUID  | → glass_options(id)      |
| price_per_m2   | REAL    | Precio por m²             |
| is_active      | BOOLEAN | DEFAULT true               |

### accessories

| Columna    | Tipo         | Descripción                |
|-----------|-------------|----------------------------|
| id        | UUID (PK)   |                            |
| name      | TEXT (UNIQUE)| "Burlete"                 |
| code      | TEXT (UNIQUE)| "burlete"                 |
| description | TEXT       |                            |
| price     | REAL         | Precio natural             |
| price_cafe| REAL         | Precio café                |
| unit      | TEXT         | "metro", "unidad", "par"   |
| is_active | BOOLEAN      | DEFAULT true               |
| sort_order| INTEGER      | DEFAULT 0                  |

### product_line_accessories (M:N)

| Columna         | Tipo   | Ref                       |
|----------------|--------|---------------------------|
| id             | UUID   |                           |
| product_line_id | UUID  | → product_lines(id)      |
| accessory_id   | UUID   | → accessories(id)         |
| is_active      | BOOLEAN | DEFAULT true               |

### profile_prices

| Columna         | Tipo   | Descripción                |
|----------------|--------|----------------------------|
| id             | UUID   |                            |
| product_line_id | UUID  | → product_lines(id)       |
| profile_name   | TEXT    | "Riel Inferior"            |
| profile_code   | TEXT    | "5001"                     |
| price_natural  | REAL    | Precio por barra 6m        |
| price_cafe     | REAL    | Precio café                |
| strip_length_m | REAL    | DEFAULT 6                  |
| is_active      | BOOLEAN | DEFAULT true               |
| sort_order     | INTEGER | DEFAULT 0                  |

### pricing_rules

| Columna         | Tipo   | Descripción                |
|----------------|--------|----------------------------|
| id             | UUID   |                            |
| product_line_id | UUID  | → product_lines(id)       |
| name           | TEXT    | "Área mínima"              |
| rule_type      | TEXT    | "minimum_area", "rounding_multiple", "labor_cost", "max_dimension_width", "max_dimension_height" |
| value          | REAL    |                            |
| unit           | TEXT    | "m2", "mm", "CLP"          |
| min_panels     | INTEGER |                            |
| max_panels     | INTEGER |                            |
| is_active      | BOOLEAN | DEFAULT true               |

## Tablas de Cotizaciones

### quotes

| Columna        | Tipo         | Descripción                |
|---------------|-------------|----------------------------|
| id            | UUID (PK)   |                            |
| quote_number  | TEXT (UNIQUE)| "COT-0001"               |
| status        | TEXT         | "draft", "sent", "approved", "rejected" |
| client_name   | TEXT         |                            |
| client_email  | TEXT         |                            |
| client_phone  | TEXT         |                            |
| notes         | TEXT         |                            |
| total_subtotal| REAL         |                            |
| total_tax     | REAL         |                            |
| total_amount  | REAL         |                            |
| currency      | TEXT         | DEFAULT "CLP"              |
| expires_at    | TIMESTAMPTZ  |                            |
| created_at    | TIMESTAMPTZ  | DEFAULT now()              |
| updated_at    | TIMESTAMPTZ  | DEFAULT now()              |

### quote_items

| Columna            | Tipo    | Ref                     |
|-------------------|---------|--------------------------|
| id                | UUID    |                          |
| quote_id          | UUID    | → quotes(id)            |
| product_type_id   | UUID    | → product_types(id)      |
| product_line_id   | UUID    | → product_lines(id)      |
| glass_option_id   | UUID    | → glass_options(id)      |
| color_id          | UUID?   | → colors(id)             |
| width_mm          | INTEGER |                          |
| height_mm         | INTEGER |                          |
| panel_count        | INTEGER | DEFAULT 1                |
| quantity          | INTEGER | DEFAULT 1                |
| observations      | TEXT    |                          |
| profiles_total    | REAL    |                          |
| glass_total       | REAL    |                          |
| accessories_total | REAL    |                          |
| labor_total       | REAL    |                          |
| subtotal          | REAL    |                          |
| margin_amount     | REAL    |                          |
| pre_total         | REAL    |                          |
| tax               | REAL    |                          |
| total             | REAL    |                          |

### quote_item_accessories

| Columna       | Tipo   | Ref                       |
|--------------|--------|---------------------------|
| id           | UUID   |                           |
| quote_item_id | UUID  | → quote_items(id)        |
| accessory_id | UUID   | → accessories(id)         |
| quantity     | INTEGER | DEFAULT 1                 |
| unit_price   | REAL    |                           |
| total_price  | REAL    |                           |

### quote_item_breakdowns

| Columna       | Tipo   | Descripción                |
|--------------|--------|----------------------------|
| id           | UUID   |                            |
| quote_item_id | UUID  | → quote_items(id)         |
| concept      | TEXT    | "profiles", "glass", etc. |
| label        | TEXT    | Texto descriptivo          |
| amount       | REAL    |                            |
| percentage   | REAL?   |                            |
| sort_order   | INTEGER |                            |
