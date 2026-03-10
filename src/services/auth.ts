/**
 * src/services/auth.ts
 * Servicio de autenticación para PropiedadesRD
 *
 * ENDPOINTS CUBIERTOS (del OpenAPI):
 *  POST /auth/register  → Registro de usuario (devuelve token directo)
 *  POST /auth/login     → Login con email/password
 *  POST /auth/refresh   → Refresco de access_token via cookie httpOnly
 *  POST /auth/logout    → Invalidar sesión en el backend
 *  GET  /auth/me        → Obtener usuario autenticado
 *
 * RESPONSABILIDADES DE ESTE SERVICIO:
 *  - Llamar al backend via apiFetch
 *  - Escribir/limpiar la cookie "access_token" en el servidor Next.js
 *  - Devolver datos tipados o errores normalizados
 *
 * NOTA: La escritura de cookies httpOnly SOLO puede hacerse en
 *  Server Actions o Route Handlers — no en Client Components.
 *  Los componentes cliente llaman a los Route Handlers de /app/api/auth/
 *  que internamente usan estas funciones.
 */

"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
  ApiResponse,
  UserRole,
} from "@/lib/api";

// ─────────────────────────────────────────────
// Configuración de cookies
// ─────────────────────────────────────────────

const COOKIE_NAME = "access_token";

/**
 * Duración del access_token en el cliente.
 * Debe coincidir (o ser menor) con el exp del JWT del backend.
 * Ajustar según la configuración de FastAPI.
 */
const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 30; // 30 minutos

function setAccessTokenCookie(token: string): void {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });
}

function clearAccessTokenCookie(): void {
  cookies().delete(COOKIE_NAME);
}

// ─────────────────────────────────────────────
// Tipos de retorno del servicio
// ─────────────────────────────────────────────

export interface AuthResult {
  success: boolean;
  user?: UserResponse;
  error?: string;
}

// ─────────────────────────────────────────────
// register
// POST /auth/register
// El backend devuelve el token directamente — el usuario queda logueado al registrarse
// ─────────────────────────────────────────────

export async function register(data: RegisterRequest): Promise<AuthResult> {
  const result = await apiFetch<TokenResponse>("/auth/register", {
    method: "POST",
    body: data,
    public: true,
  });

  if (result.error || !result.data) {
    return {
      success: false,
      error: result.error?.message ?? "No se pudo completar el registro.",
    };
  }

  // Escribir cookie httpOnly con el access_token
  setAccessTokenCookie(result.data.access_token);

  // Obtener datos del usuario recién registrado
  const meResult = await getMe();

  return {
    success: true,
    user: meResult.data ?? undefined,
  };
}

// ─────────────────────────────────────────────
// login
// POST /auth/login
// ─────────────────────────────────────────────

export async function login(data: LoginRequest): Promise<AuthResult> {
  const result = await apiFetch<TokenResponse>("/auth/login", {
    method: "POST",
    body: data,
    public: true,
  });

  if (result.error || !result.data) {
    return {
      success: false,
      error: result.error?.message ?? "Credenciales inválidas.",
    };
  }

  setAccessTokenCookie(result.data.access_token);

  // Obtener datos del usuario para devolverlos al componente
  const meResult = await getMe();

  return {
    success: true,
    user: meResult.data ?? undefined,
  };
}

// ─────────────────────────────────────────────
// loginAndRedirect
// Versión de login para formularios de Server Action que redirigen automáticamente.
// Uso: action={loginAndRedirect} en <form>
// ─────────────────────────────────────────────

export async function loginAndRedirect(
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/dashboard";

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos." };
  }

  const result = await login({ email, password });

  if (!result.success) {
    return { error: result.error };
  }

  redirect(redirectTo);
}

// ─────────────────────────────────────────────
// refreshToken
// POST /auth/refresh
// El backend lee el refresh_token desde su propia cookie httpOnly.
// Solo actualiza el access_token en el cliente.
// ─────────────────────────────────────────────

export async function refreshToken(): Promise<AuthResult> {
  const result = await apiFetch<TokenResponse>("/auth/refresh", {
    method: "POST",
    // No enviamos body — el backend lee su cookie httpOnly de refresh_token
    public: true,
  });

  if (result.error || !result.data) {
    // Si el refresh falla, la sesión está muerta — limpiar cookie local
    clearAccessTokenCookie();
    return {
      success: false,
      error: result.error?.message ?? "Sesión expirada. Por favor inicia sesión nuevamente.",
    };
  }

  setAccessTokenCookie(result.data.access_token);

  return { success: true };
}

// ─────────────────────────────────────────────
// logout
// POST /auth/logout
// Invalida el token en el backend y limpia la cookie local
// ─────────────────────────────────────────────

export async function logout(): Promise<void> {
  // Intentar invalidar en el backend (best-effort — no bloqueamos si falla)
  await apiFetch("/auth/logout", {
    method: "POST",
  }).catch(() => {
    // Ignorar errores de red en logout — igual limpiamos la cookie
  });

  clearAccessTokenCookie();
  redirect("/login");
}

// ─────────────────────────────────────────────
// getMe
// GET /auth/me
// Obtener usuario autenticado. Útil en layouts y Server Components.
// ─────────────────────────────────────────────

export async function getMe(): Promise<ApiResponse<UserResponse>> {
  return apiFetch<UserResponse>("/auth/me");
}

// ─────────────────────────────────────────────
// getCurrentUser
// Wrapper de getMe que devuelve null si no hay sesión (no lanza error).
// Uso en layouts: const user = await getCurrentUser()
// ─────────────────────────────────────────────

export async function getCurrentUser(): Promise<UserResponse | null> {
  const result = await getMe();

  if (result.error || !result.data) {
    return null;
  }

  return result.data;
}

// ─────────────────────────────────────────────
// requireAuth
// Guard para Server Components y Server Actions.
// Si no hay sesión válida, redirige al login.
// Uso: const user = await requireAuth()
// ─────────────────────────────────────────────

export async function requireAuth(): Promise<UserResponse> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

// ─────────────────────────────────────────────
// requireRole
// Guard para páginas restringidas por rol.
// Uso: const user = await requireRole("agent")
// ─────────────────────────────────────────────

export async function requireRole(
  ...allowedRoles: UserRole[]
): Promise<UserResponse> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}
