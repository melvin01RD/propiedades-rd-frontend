# CLAUDE.md — src/services/

## Proposito
Capa de acceso al backend (FastAPI). UNICA parte del frontend que hace llamadas HTTP.

## Regla absoluta
Ningun componente, pagina ni hook llama directamente a fetch con URLs del backend.
Todo pasa por esta capa.

Los hooks SWR en src/hooks/ usan funciones de services/ como fetcher:
useSWR('/key', () => propertiesService.getAll())  ← correcto
useSWR('/key', () => fetch('/api/...'))            ← prohibido

## Archivos
- properties.ts  → CRUD y busqueda de propiedades
- auth.ts        → Login, registro, refresh de token
- favorites.ts   → Guardar y eliminar favoritos

## Endpoints disponibles
POST  /auth/register
POST  /auth/login
POST  /auth/refresh
GET   /properties
GET   /properties/{id}
POST  /properties
PUT   /properties/{id}
DELETE /properties/{id}
GET   /properties/search?city=&min_price=&max_price=&bedrooms=&type=&operation=
GET   /favorites
POST  /favorites/{property_id}
DELETE /favorites/{property_id}

## Manejo de errores
Los errores HTTP se normalizan en lib/api.ts.
Los servicios no usan try/catch salvo casos especificos.
