# 🏠 PropiedadesRD — Frontend

> Marketplace inmobiliario para República Dominicana. Busca, filtra y publica propiedades con mapas interactivos, estimación de precios por zona y analytics de mercado.

---

## ¿Qué es esto?

PropiedadesRD es una plataforma inmobiliaria construida para el mercado dominicano. A diferencia de los portales existentes, combina búsqueda avanzada con datos de mercado por zona — precio promedio por sector, tendencias, y estimación de valor de propiedades.

Este repositorio contiene el **frontend**. El backend (FastAPI) vive en un repositorio separado.

---

## Stack

| Capa              | Tecnología              |
| ----------------- | ----------------------- |
| Framework         | Next.js 14 (App Router) |
| Lenguaje          | TypeScript              |
| Estilos           | Tailwind CSS            |
| Componentes UI    | shadcn/ui               |
| Mapas             | Mapbox GL JS            |
| Estado cliente    | Zustand                 |
| Fetching servidor | fetch nativo de Next.js |
| Fetching cliente  | SWR                     |

---

## Funcionalidades

- 🔍 **Búsqueda avanzada** — filtros por ciudad, precio, habitaciones, tipo y operación (venta/alquiler)
- 🗺️ **Mapa interactivo** — propiedades geolocalizadas con clusters en Mapbox
- 🏡 **Publicación de propiedades** — CRUD completo para agentes y propietarios
- ❤️ **Favoritos** — guarda y gestiona propiedades de interés
- 👤 **Roles** — comprador, agente inmobiliario y administrador
- 📊 **Analytics de mercado** _(próximamente)_ — precio promedio por sector, heatmaps de inversión
- 🤖 **Estimador de precios** _(próximamente)_ — valoración automática basada en comparables

---

## Estructura del proyecto

```
src/
├── app/                  # Rutas (App Router)
│   ├── propiedades/      # Listado con filtros y mapa
│   ├── propiedad/[id]/   # Detalle de propiedad
│   ├── publicar/         # Formulario de publicación
│   ├── favoritos/        # Lista de favoritos
│   └── (auth)/           # Login y registro
├── components/
│   ├── property/         # PropertyCard, PropertyGrid, PropertyDetail
│   ├── map/              # MapView, marcadores, clusters
│   ├── search/           # SearchBar, FiltersPanel, SortSelector
│   ├── auth/             # LoginForm, RegisterForm
│   └── ui/               # Componentes base
├── services/             # Capa de acceso al backend (única)
├── hooks/                # Hooks cliente reutilizables
└── lib/                  # Cliente HTTP, helpers de auth, utils
```

---

## Requisitos previos

- Node.js 18+
- Backend de PropiedadesRD corriendo en `http://localhost:8000`
- Token de Mapbox

---

## Configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/propiedades-rd-frontend.git
cd propiedades-rd-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_aqui
```

```bash
# 4. Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Comandos disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run lint       # ESLint
npm run typecheck  # TypeScript sin emitir
```

---

## Arquitectura de decisiones

La documentación de decisiones técnicas (ADRs) está en `docs/decisions/`.
La arquitectura general está en `docs/architecture.md`.

---

## Repositorios relacionados

| Repo                     | Descripción                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| `propiedades-rd-backend` | API en FastAPI — autenticación, propiedades, búsqueda, favoritos |

---

## Licencia

MIT
