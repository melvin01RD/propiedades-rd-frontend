/**
 * middleware.ts  (raíz del proyecto Next.js)
 * Protección de rutas para PropiedadesRD
 *
 * RUTAS PROTEGIDAS (requieren auth):
 *  /dashboard      → agente/propietario
 *  /perfil         → cualquier usuario autenticado
 *  /propiedades/nueva → solo agente/propietario (no guest)
 *  /alertas        → cualquier usuario autenticado
 *
 * ROLES DEL SISTEMA (del OpenAPI):
 *  "agent"  → puede crear/editar propiedades, tiene perfil de agente
 *  "owner"  → puede crear/editar propiedades, tiene perfil de propietario
 *  "admin"  → acceso total
 *
 * FLUJO:
 *  1. Ruta pública → pasar siempre
 *  2. Ruta protegida sin token válido → /login?redirect=<ruta>
 *  3. Ruta protegida con token pero rol insuficiente → /unauthorized
 *  4. /login o /registro con token válido → /dashboard
 *  5. Resto → pasar
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole } from "@/lib/api";

// ─────────────────────────────────────────────
// Configuración de rutas protegidas
// ─────────────────────────────────────────────

interface ProtectedRoute {
  /** Prefijo de ruta a proteger */
  path: string;
  /** Roles permitidos. Si está vacío = cualquier rol autenticado */
  roles?: UserRole[];
}

const PROTECTED_ROUTES: ProtectedRoute[] = [
  { path: "/dashboard" },                                              // cualquier usuario autenticado
  { path: "/perfil" },                                                 // cualquier usuario autenticado
  { path: "/alertas" },                                                // cualquier usuario autenticado
  { path: "/propiedades/nueva", roles: ["agent", "owner", "admin"] }, // solo pueden publicar
];

/** Rutas de auth — redirigir a /dashboard si ya hay sesión */
const AUTH_ROUTES = ["/login", "/registro"];

/** Prefijos que el middleware NUNCA debe interceptar */
const SKIP_PREFIXES = ["/_next", "/favicon", "/public/", "/api/"];

// ─────────────────────────────────────────────
// Helper: verificar expiración del JWT (sin validar firma)
// Solo para UX — el backend siempre valida la firma real
// ─────────────────────────────────────────────

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    // Base64URL → JSON
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    if (!payload.exp) return false;

    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowSeconds;
  } catch {
    return true;
  }
}

// ─────────────────────────────────────────────
// Helper: extraer el rol del payload JWT
// ─────────────────────────────────────────────

function getRoleFromToken(token: string): UserRole | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );

    // El campo puede llamarse "role", "roles", o "sub" dependiendo del backend
    // Ajustar si el backend usa otro claim
    return (payload.role as UserRole) ?? null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// Helper: verificar si la ruta coincide con un patrón
// ─────────────────────────────────────────────

function matchesPath(pathname: string, pattern: string): boolean {
  return pathname === pattern || pathname.startsWith(`${pattern}/`);
}

// ─────────────────────────────────────────────
// Middleware principal
// ─────────────────────────────────────────────

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Saltar archivos estáticos y rutas internas de Next.js
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 2. Leer token de la cookie httpOnly
  const token = request.cookies.get("access_token")?.value;
  const hasValidToken = Boolean(token && !isTokenExpired(token));
  const userRole = hasValidToken && token ? getRoleFromToken(token) : null;

  // 3. Verificar si la ruta está protegida
  const matchedRoute = PROTECTED_ROUTES.find((route) =>
    matchesPath(pathname, route.path)
  );

  if (matchedRoute) {
    // Sin token → redirigir a login guardando la ruta de destino
    if (!hasValidToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Con token pero rol insuficiente → página de no autorizado
    if (matchedRoute.roles && matchedRoute.roles.length > 0) {
      if (!userRole || !matchedRoute.roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  // 4. Ruta de auth con sesión activa → redirigir a dashboard
  if (AUTH_ROUTES.some((r) => matchesPath(pathname, r)) && hasValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 5. Pasar en todos los demás casos
  return NextResponse.next();
}

// ─────────────────────────────────────────────
// Matcher: rutas donde se ejecuta el middleware
// Excluye archivos estáticos con extensión
// ─────────────────────────────────────────────

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|js|css|map)).*)",
  ],
};
