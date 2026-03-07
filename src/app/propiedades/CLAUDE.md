# CLAUDE.md — src/app/propiedades/

## Proposito
Ruta principal de busqueda y listado. URL: /propiedades

## Layout
Panel izquierdo: FiltersPanel + PropertyGrid
Panel derecho: MapView (Mapbox) con marcadores sincronizados

## Arquitectura
page.tsx es Server Component que:
1. Lee searchParams de la URL
2. Llama a services/properties.ts
3. Pasa datos a componentes hijos

## Filtros disponibles (query params)
city, min_price, max_price, bedrooms, type, operation

## Regla de filtros
Los filtros actualizan la URL con useRouter para permitir
compartir busquedas y mantener historial del navegador.

## Server vs Client en esta ruta
- page.tsx → Server Component (lee searchParams, llama a services/)
- FiltersPanel → "use client" (usa useRouter para actualizar query params)
- MapView → "use client" (Mapbox requiere browser APIs)
- PropertyGrid → Server Component (recibe props del server)
