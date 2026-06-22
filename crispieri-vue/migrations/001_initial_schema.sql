-- Crispieri Cotizador — Schema Inicial
-- PostgreSQL

-- ============================================
-- EXTENSIONES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLAS DE CATÁLOGO
-- ============================================

CREATE TABLE product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  margin_pct REAL NOT NULL DEFAULT 0,
  margin_pct_cafe REAL NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_type_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
  product_line_id UUID NOT NULL REFERENCES product_lines(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_type_id, product_line_id)
);

CREATE TABLE colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  hex_value TEXT,
  surcharge_pct REAL NOT NULL DEFAULT 0,
  is_ral BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_line_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_line_id UUID NOT NULL REFERENCES product_lines(id) ON DELETE CASCADE,
  color_id UUID NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_line_id, color_id)
);

CREATE TABLE glass_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_line_glass (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_line_id UUID NOT NULL REFERENCES product_lines(id) ON DELETE CASCADE,
  glass_option_id UUID NOT NULL REFERENCES glass_options(id) ON DELETE CASCADE,
  price_per_m2 REAL NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_line_id, glass_option_id)
);

CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  price REAL NOT NULL,
  price_cafe REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'unidad',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_line_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_line_id UUID NOT NULL REFERENCES product_lines(id) ON DELETE CASCADE,
  accessory_id UUID NOT NULL REFERENCES accessories(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_line_id, accessory_id)
);

CREATE TABLE profile_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_line_id UUID NOT NULL REFERENCES product_lines(id) ON DELETE CASCADE,
  profile_name TEXT NOT NULL,
  profile_code TEXT NOT NULL,
  price_natural REAL NOT NULL,
  price_cafe REAL NOT NULL,
  strip_length_m REAL NOT NULL DEFAULT 6,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_line_id UUID NOT NULL REFERENCES product_lines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT,
  min_panels INTEGER,
  max_panels INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- TABLAS DE COTIZACIONES
-- ============================================

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  notes TEXT,
  total_subtotal REAL NOT NULL DEFAULT 0,
  total_tax REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'CLP',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  product_type_id UUID NOT NULL REFERENCES product_types(id),
  product_line_id UUID NOT NULL REFERENCES product_lines(id),
  glass_option_id UUID NOT NULL REFERENCES glass_options(id),
  color_id UUID REFERENCES colors(id),
  width_mm INTEGER NOT NULL,
  height_mm INTEGER NOT NULL,
  panel_count INTEGER NOT NULL DEFAULT 1,
  quantity INTEGER NOT NULL DEFAULT 1,
  observations TEXT,
  profiles_total REAL NOT NULL DEFAULT 0,
  glass_total REAL NOT NULL DEFAULT 0,
  accessories_total REAL NOT NULL DEFAULT 0,
  labor_total REAL NOT NULL DEFAULT 0,
  subtotal REAL NOT NULL DEFAULT 0,
  margin_amount REAL NOT NULL DEFAULT 0,
  pre_total REAL NOT NULL DEFAULT 0,
  tax REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quote_item_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_item_id UUID NOT NULL REFERENCES quote_items(id) ON DELETE CASCADE,
  accessory_id UUID NOT NULL REFERENCES accessories(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  UNIQUE(quote_item_id, accessory_id)
);

CREATE TABLE quote_item_breakdowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_item_id UUID NOT NULL REFERENCES quote_items(id) ON DELETE CASCADE,
  concept TEXT NOT NULL,
  label TEXT NOT NULL,
  amount REAL NOT NULL,
  percentage REAL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
