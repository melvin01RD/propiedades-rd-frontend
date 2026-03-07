# CLAUDE.md — src/components/

## Proposito
Componentes React reutilizables de la plataforma. Organizados por dominio funcional.

## Regla principal
Todo componente es **Server Component por defecto**.
Solo agregar `"use client"` si el componente necesita:
- `useState` / `useReducer`
- `useEffect`
- Eventos del navegador (`onClick`, `onChange`, etc.)
- Hooks de librerias de terceros que requieran cliente (Mapbox, SWR, etc.)

## Estructura de carpetas
- property/  → Tarjetas, grids y detalle de propiedades
- map/       → Mapa Mapbox, marcadores, clusters
- search/    → Barra de busqueda, panel de filtros, ordenamiento
- auth/      → Formularios de login y registro
- ui/        → Componentes base (shadcn/ui + custom)

## Convenciones
- Archivos: PascalCase → PropertyCard.tsx
- Un componente por archivo, export default
- Props siempre tipadas con interface nombrada, nunca any

## Lo que NO va aqui
- Llamadas HTTP → src/services/
- Estado global → src/hooks/
- Utilidades → src/lib/
