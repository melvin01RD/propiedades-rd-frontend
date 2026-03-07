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
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
GET    /properties
GET    /properties/{id}
POST   /properties
PUT    /properties/{id}
DELETE /properties/{id}
GET    /properties/search?city=&min_price=&max_price=&bedrooms=&type=&operation=
GET    /favorites
POST   /favorites/{property_id}
DELETE /favorites/{property_id}
```

---

## Arquitectura del frontend

### Regla principal de componentes

Todo es Server Component por defecto.
Solo agregar "use client" cuando el componente necesite:
- estado (useState, useReducer)
- efectos (useEffect)
- eventos del navegador (onClick, onChange, etc.)
- hooks de terceros que requieran cliente

### Estructura de carpetas

src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── propiedades/
│   ├── propiedad/[id]/
│   ├── publicar/
│   ├── favoritos/
│   └── (auth)/login/ y registro/
├── components/
│   ├── property/
│   ├── map/
│   ├── search/
│   ├── auth/
│   └── ui/
├── services/
├── hooks/
└── lib/

---

## Convenciones obligatorias

- Componentes: PascalCase → PropertyCard.tsx
- Hooks: camelCase con prefijo use → useProperties.ts
- Servicios: camelCase → properties.ts
- services/ es la ÚNICA capa que llama al backend
- Rutas protegidas usan middleware.ts, no guards en componentes
- Errores HTTP se manejan en lib/api.ts

## Variables de entorno

NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_MAPBOX_TOKEN=
JWT_SECRET=

---

## Lo que NO está implementado aún en el backend

- Estimador de precios (analytics)
- Heatmaps de inversión por zona
- Scrapers de datos de mercado
- Panel administrativo

---

## Comandos del proyecto

npm run dev
npm run build
npm run lint
npm run typecheck
