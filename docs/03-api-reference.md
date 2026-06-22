# API Reference — InsForge Edge Functions

Base URL: `https://<project>.insforge.dev/functions/v1`

## Catalog

### `GET /catalog`

Devuelve todo el catálogo de productos en una sola respuesta.

**Response** `200`

```json
{
  "productTypes": [{ "id": "uuid", "name": "Ventana Corredera", "code": "corredera", ... }],
  "productLines": [{ "id": "uuid", "name": "Línea 5000", "code": "linea-5000", ... }],
  "productTypeLines": [{ "id": "uuid", "productTypeId": "uuid", "productLineId": "uuid" }],
  "colors": [{ "id": "uuid", "name": "Natural", "code": "natural", "hexValue": "#C0C0C0", ... }],
  "productLineColors": [{ "id": "uuid", "productLineId": "uuid", "colorId": "uuid" }],
  "glassOptions": [{ "id": "uuid", "name": "Doble Incoloro", "code": "doble-inc", ... }],
  "productLineGlass": [{ "id": "uuid", "productLineId": "uuid", "glassOptionId": "uuid", "pricePerM2": 15900 }],
  "accessories": [{ "id": "uuid", "name": "Burlete", "code": "burlete", "price": 300, ... }],
  "productLineAccessories": [{ "id": "uuid", "productLineId": "uuid", "accessoryId": "uuid" }],
  "profilePrices": [{ "id": "uuid", "productLineId": "uuid", "profileName": "Riel Inferior", ... }],
  "pricingRules": [{ "id": "uuid", "productLineId": "uuid", "ruleType": "rounding_multiple", "value": 1000 }]
}
```

## Pricing

### `POST /pricing`

Calcula el precio de un item usando la fórmula Crispieri completa.

**Request**

```json
{
  "widthMm": 1200,
  "heightMm": 1500,
  "panelCount": 2,
  "quantity": 1,
  "productLineCode": "linea-5000",
  "productTypeCode": "corredera",
  "marginPct": 15,
  "marginPctCafe": 25,
  "colorCode": "natural",
  "glassPricePerM2": 15900,
  "profilePrices": [{ "profileName": "Riel Inferior", "profileCode": "5001", "priceNatural": 8408, "priceCafe": 9861, "stripLengthM": 6 }],
  "accessoryPrices": [{ "name": "Burlete", "code": "burlete", "price": 300, "priceCafe": 300, "unit": "metro", "quantity": 1 }],
  "laborCost": 20000,
  "roundingMultiple": 1000
}
```

**Response** `200`

```json
{
  "areaM2": 1.8,
  "perimeterM": 5.4,
  "profilesTotal": 45000,
  "glassTotal": 28620,
  "accessoriesTotal": 1620,
  "laborTotal": 20000,
  "subtotal": 95240,
  "marginAmount": 14286,
  "marginMultiplier": 1.15,
  "preTotal": 110000,
  "tax": 20900,
  "total": 110000,
  "unitTotal": 110000
}
```

## Quotes

### `GET /quotes`

Lista cotizaciones con paginación.

**Query**: `?page=1&limit=20&status=draft`

**Response** `200`

```json
{
  "quotes": [{ "id": "uuid", "quoteNumber": "COT-0001", "status": "draft", ... }],
  "pagination": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 }
}
```

### `POST /quotes`

Crea una cotización nueva.

**Request**

```json
{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@ejemplo.cl",
  "clientPhone": "+56912345678",
  "notes": "Para proyecto edificio A",
  "items": [{
    "productTypeId": "uuid",
    "productLineId": "uuid",
    "glassOptionId": "uuid",
    "colorId": "uuid",
    "widthMm": 1200,
    "heightMm": 1500,
    "panelCount": 2,
    "quantity": 2,
    "observations": "Con burlete",
    "accessories": [{ "accessoryId": "uuid", "quantity": 1 }]
  }]
}
```

**Response** `201`: Objeto Quote completo con items, accessories y breakdowns.

### `GET /quotes/:id`

Obtiene una cotización por ID.

### `PUT /quotes/:id`

Actualiza estado o datos de una cotización.

### `DELETE /quotes/:id`

Elimina una cotización.

### `PUT /quotes/:id/status`

Cambia el estado: `"sent"`, `"approved"`, `"rejected"`.

### `POST /quotes/:id/duplicate`

Duplica una cotización existente.
