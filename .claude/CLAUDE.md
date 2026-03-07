# CLAUDE.md — Frontend (Zillow RD Clone)

## Contexto del proyecto

Plataforma inmobiliaria para República Dominicana. Permite buscar, publicar y analizar
propiedades en venta y alquiler. Incluye mapas interactivos, filtros avanzados,
estimador de precios y analytics de mercado por zona.

Este repositorio es el **frontend**. El backend es un servicio separado construido
en FastAPI con autenticación JWT propia.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Componentes UI | shadcn/ui |
| Mapas | Mapbox GL JS |
| Estado cliente | Zustand |
| Fetching servidor | fetch nativo de Next.js (con cache/revalidation) |
| Fetching cliente | SWR |

---

## Conexión con el backend

- **Base URL local:** `http://localhost:8000`
- **Base URL producción:** definida en `NEXT_PUBLIC_API_URL` (variable de entorno)
- **Autenticación:** JWT — el token se almacena en cookie httpOnly, nunca en localStorage
- **Header requerido:** `Authorization: Bearer <token>` en rutas protegidas

### Módulos del backend disponibles

Todos estos endpoints están implementados y listos para consumir:

```
# Autenticación
POST   /auth/register
POST   /auth/login
POST   /auth/refresh

# Propiedades
GET    /properties
GET    /properties/{id}
POST   /properties
PUT    /properties/{id}
DELETE /properties/{id}

# Búsqueda y filtros
GET    /properties/search?city=&min_price=&max_price=&bedrooms=&type=&operation=

# Favoritos
GET    /favorites
POST   /favorites/{property_id}
DELETE /favorites/{property_id}
```

---

## Arquitectura del frontend

### Regla principal de componentes

> **Todo es Server Component por defecto.**
> Solo agregar `"use client"` cuando el componente necesite:
> - estado (`useState`, `useReducer`)
> - efectos (`useEffect`)
> - eventos del navegador (onClick, onChange, etc.)
> - hooks de terceros que requieran cliente

### Estructura de carpetas

```
src/
├── app/                        ← Rutas (App Router)
│   ├── layout.tsx
│   ├── page.tsx                ← Home / búsqueda principal
│   ├── propiedades/
│   │   ├── page.tsx            ← Listado con filtros
│   │   └── CLAUDE.md
│   ├── propiedad/
│   │   └── [id]/
│   │       └── page.tsx        ← Detalle de propiedad
│   ├── publicar/
│   │   └── page.tsx            ← Formulario de publicación (protegida)
│   ├── favoritos/
│   │   └── page.tsx            ← Lista de favoritos (protegida)
│   └── (auth)/
│       ├── login/page.tsx
│       └── registro/page.tsx
│
├── components/
│   ├── CLAUDE.md
│   ├── property/               ← PropertyCard, PropertyGrid, PropertyDetail
│   ├── map/                    ← MapView, PropertyMarker, ClusterLayer
│   ├── search/                 ← SearchBar, FiltersPanel, SortSelector
│   ├── auth/                   ← LoginForm, RegisterForm
│   └── ui/                     ← Componentes base (shadcn/ui + custom)
│
├── services/                   ← ÚNICA capa que habla con el backend
│   ├── CLAUDE.md
│   ├── properties.ts
│   ├── auth.ts
│   └── favorites.ts
│
├── hooks/                      ← Hooks cliente reutilizables
│   ├── useProperties.ts
│   ├── useMap.ts
│   └── useAuth.ts
│
└── lib/
    ├── api.ts                  ← Cliente HTTP base (fetch wrapper)
    ├── auth.ts                 ← Helpers de JWT / cookies
    └── utils.ts
```

---

## Convenciones obligatorias

### Naming

- Componentes: `PascalCase` → `PropertyCard.tsx`
- Hooks: `camelCase` con prefijo `use` → `useProperties.ts`
- Servicios: `camelCase` → `properties.ts`
- Rutas de API interna (route handlers): `kebab-case`

### Servicios

La capa `services/` es la **única** que realiza llamadas HTTP al backend.
Los componentes y páginas **nunca** llaman directamente a `fetch` con URLs del backend.

```ts
// ✅ Correcto
import { getProperties } from "@/services/properties"

// ❌ Incorrecto — nunca hacer esto en un componente
const res = await fetch("http://localhost:8000/properties")
```

### Rutas protegidas

Las páginas que requieren autenticación usan middleware de Next.js (`middleware.ts`).
No implementar guards a nivel de componente.

### Manejo de errores HTTP

Todos los errores del backend se manejan en `lib/api.ts`.
Los componentes reciben datos limpios o `null`, nunca manejan errores de red directamente.

### Variables de entorno

```
NEXT_PUBLIC_API_URL=        ← URL pública del backend
NEXT_PUBLIC_MAPBOX_TOKEN=   ← Token de Mapbox
JWT_SECRET=                 ← Solo para verificación server-side si aplica
```

---

## Layout principal de la app

```
┌─────────────────────────────────────────────┐
│  Navbar (búsqueda rápida + auth)            │
├──────────────┬──────────────────────────────┤
│ FiltersPanel │ MapView (Mapbox)             │
│              │  📍 📍 📍                   │
│ PropertyGrid │                             │
│ (lista)      │                             │
└──────────────┴──────────────────────────────┘
```

La vista principal divide la pantalla en:
- Panel izquierdo: filtros + lista de propiedades
- Panel derecho: mapa con marcadores sincronizados con la lista

---

## Lo que NO está implementado aún en el backend

Los siguientes módulos se desarrollarán en fases posteriores.
No asumir que existen endpoints para:

- Estimador de precios (analytics)
- Heatmaps de inversión por zona
- Scrapers de datos de mercado
- Panel administrativo

---

## Comandos del proyecto

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run lint      # ESLint
npm run typecheck # TypeScript sin emitir
```
