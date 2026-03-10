/**
 * lib/api.ts
 * Cliente HTTP centralizado para PropiedadesRD
 *
 * HALLAZGOS DEL OPENAPI:
 *  - Las rutas NO tienen prefijo /api/v1 → van directo: /auth/login, /properties, etc.
 *  - El backend soporta /auth/refresh leyendo refresh_token desde cookie HttpOnly
 *  - Roles: "agent" | "owner" | "admin"
 *  - TokenResponse: { access_token: string, token_type: string }
 *  - Autenticación: HTTPBearer → Authorization: Bearer <token>
 *
 * ARQUITECTURA DE TOKENS:
 *  - access_token  → cookie httpOnly "access_token" (corta duración)
 *  - refresh_token → cookie httpOnly "refresh_token" (gestionada por el backend)
 *  - NUNCA tokens en localStorage
 *  - El refresco se hace llamando POST /auth/refresh (el backend lee su propia cookie)
 */

import { cookies } from "next/headers";

// ─────────────────────────────────────────────
// Configuración base
// ─────────────────────────────────────────────

/** Sin prefijo /api/v1 — el OpenAPI confirma rutas directas */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const DEFAULT_TIMEOUT_MS = 10_000;

// ─────────────────────────────────────────────
// Tipos base del cliente
// ─────────────────────────────────────────────

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Si true, no adjunta Authorization header (login, registro, catálogos públicos) */
  public?: boolean;
  timeout?: number;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  detail?: string | ValidationErrorItem[] | Record<string, unknown>;
}

export interface ValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// ─────────────────────────────────────────────
// Tipos del dominio — extraídos del OpenAPI
// ─────────────────────────────────────────────

export type UserRole = "agent" | "owner" | "admin";
export type OperationType = "sale" | "rent";
export type PropertyType = "house" | "apartment" | "commercial" | "villa";
export type PropertyStatus = "draft" | "active" | "inactive" | "sold" | "rented";
export type Currency = "DOP" | "USD";
export type AmenityCategory = "security" | "recreation" | "services" | "exterior";

// Auth
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: UserRole;
}

// Catálogos
export interface ProvinceResponse {
  id: number;
  name: string;
  code: string;
}

export interface SectorResponse {
  id: number;
  name: string;
  province_id: number;
}

export interface AmenityResponse {
  id: number;
  name: string;
  slug: string;
  category: AmenityCategory;
  icon: string | null;
}

export interface AmenitiesByCategoryResponse {
  category: AmenityCategory;
  items: AmenityResponse[];
}

// Propiedades
export interface PropertyImageEmbed {
  id: string;
  cloudinary_url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface PropertyListItem {
  id: string;
  title: string;
  property_type: PropertyType;
  operation_type: OperationType;
  price: string;
  currency: Currency;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: string | null;
  province: ProvinceResponse;
  sector: SectorResponse | null;
  is_featured: boolean;
  cover_image: string | null;
}

export interface PropertyResponse {
  id: string;
  title: string;
  description: string | null;
  property_type: PropertyType;
  operation_type: OperationType;
  price: string;
  currency: Currency;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spots: number | null;
  area_m2: string | null;
  floors: number | null;
  year_built: number | null;
  country: string;
  city: string;
  address: string | null;
  province: ProvinceResponse;
  sector: SectorResponse | null;
  status: PropertyStatus;
  is_featured: boolean;
  images: PropertyImageEmbed[];
  amenities: AmenityResponse[];
}

export interface PropertyPageResponse {
  items: PropertyListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PropertyCreate {
  title: string;
  description?: string | null;
  property_type: PropertyType;
  operation_type: OperationType;
  price: number;
  currency?: Currency;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parking_spots?: number | null;
  area_m2?: number | null;
  floors?: number | null;
  year_built?: number | null;
  province_id: number;
  sector_id?: number | null;
  city: string;
  address?: string | null;
  amenity_ids?: number[];
}

export interface PropertyUpdate extends Partial<PropertyCreate> {
  status?: PropertyStatus | null;
  is_featured?: boolean | null;
}

export interface PropertyFilters {
  operation_type?: OperationType;
  property_type?: PropertyType;
  price_min?: number;
  price_max?: number;
  province_id?: number;
  sector_id?: number;
  bedrooms_min?: number;
  bathrooms_min?: number;
  parking_spots_min?: number;
  area_min?: number;
  area_max?: number;
  is_featured?: boolean;
  page?: number;
  limit?: number;
  order_by?: string;
  /** Se envía como body array en GET /properties */
  amenity_slugs?: string[];
}

// Alertas
export interface AlertFilters {
  operation_type?: OperationType;
  property_type?: PropertyType;
  price_min?: number;
  price_max?: number;
  province_id?: number;
  sector_id?: number;
  bedrooms_min?: number;
  bathrooms_min?: number;
  amenity_slugs?: string[];
}

export interface AlertResponse {
  id: string;
  name: string | null;
  filters: Record<string, unknown>;
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

export interface AlertCreate {
  name?: string | null;
  filters: AlertFilters;
}

export interface AlertUpdate {
  name?: string | null;
  is_active?: boolean | null;
  filters?: AlertFilters | null;
}

// Agentes
export interface AgentProfileResponse {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  license_number: string | null;
  agency_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

export interface AgentProfileCreate {
  first_name: string;
  last_name: string;
  phone?: string | null;
  license_number?: string | null;
  agency_name?: string | null;
  bio?: string | null;
}

export type AgentProfileUpdate = Partial<AgentProfileCreate>;

// Propietarios
export interface OwnerProfileResponse {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
}

export interface OwnerProfileCreate {
  first_name: string;
  last_name: string;
  phone?: string | null;
}

export type OwnerProfileUpdate = Partial<OwnerProfileCreate>;

// ─────────────────────────────────────────────
// Helper: leer access_token desde cookie httpOnly
// Solo disponible en Server Components / Route Handlers / Server Actions
// ─────────────────────────────────────────────

function getServerToken(): string | undefined {
  try {
    const cookieStore = cookies();
    return cookieStore.get("access_token")?.value;
  } catch {
    // Client Component — la cookie viaja automáticamente en el header HTTP
    return undefined;
  }
}

// ─────────────────────────────────────────────
// Helper: normalizar errores de FastAPI
// { detail: string } | { detail: ValidationErrorItem[] }
// ─────────────────────────────────────────────

async function parseError(response: Response): Promise<ApiError> {
  const status = response.status;

  const defaultMessages: Record<number, string> = {
    400: "Solicitud inválida.",
    401: "No autorizado. Por favor inicia sesión.",
    403: "No tienes permiso para realizar esta acción.",
    404: "El recurso solicitado no fue encontrado.",
    409: "Ya existe un registro con esos datos.",
    422: "Los datos enviados no son válidos.",
    429: "Demasiadas solicitudes. Intenta más tarde.",
    500: "Error interno del servidor.",
    503: "Servicio no disponible temporalmente.",
  };

  let detail: ApiError["detail"];
  let message = defaultMessages[status] ?? "Ocurrió un error inesperado.";

  try {
    const json = await response.json();

    if (json?.detail) {
      if (typeof json.detail === "string") {
        message = json.detail;
        detail = json.detail;
      } else if (Array.isArray(json.detail)) {
        // Errores Pydantic — remover "body." del loc para mensajes más limpios
        const items = json.detail as ValidationErrorItem[];
        message = items
          .map((e) => {
            const field = e.loc?.slice(1).join(".") ?? "";
            return field ? `${field}: ${e.msg}` : e.msg;
          })
          .join(" | ");
        detail = items;
      }
    }
  } catch {
    // Body no es JSON
  }

  return { message, status, detail };
}

// ─────────────────────────────────────────────
// apiFetch — función central
// ─────────────────────────────────────────────

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    public: isPublic = false,
    timeout = DEFAULT_TIMEOUT_MS,
  } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extraHeaders,
  };

  if (!isPublic) {
    const token = getServerToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: method === "GET" ? "default" : "no-store",
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      if (response.status === 204) {
        return { data: null, error: null, status: 204 };
      }
      try {
        const data: T = await response.json();
        return { data, error: null, status: response.status };
      } catch {
        return { data: null, error: null, status: response.status };
      }
    }

    const error = await parseError(response);
    return { data: null, error, status: response.status };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === "AbortError") {
      return {
        data: null,
        error: { message: "La solicitud tardó demasiado. Verifica tu conexión.", status: 408 },
        status: 408,
      };
    }

    return {
      data: null,
      error: { message: "No se pudo conectar con el servidor.", status: 0 },
      status: 0,
    };
  }
}

// ─────────────────────────────────────────────
// Sugar functions — evitan repetir method en cada llamada
// ─────────────────────────────────────────────

export const api = {
  get: <T>(endpoint: string, opts?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiFetch<T>(endpoint, { ...opts, method: "GET" }),

  post: <T>(endpoint: string, body: unknown, opts?: Omit<ApiRequestOptions, "method">) =>
    apiFetch<T>(endpoint, { ...opts, method: "POST", body }),

  put: <T>(endpoint: string, body: unknown, opts?: Omit<ApiRequestOptions, "method">) =>
    apiFetch<T>(endpoint, { ...opts, method: "PUT", body }),

  patch: <T>(endpoint: string, body: unknown, opts?: Omit<ApiRequestOptions, "method">) =>
    apiFetch<T>(endpoint, { ...opts, method: "PATCH", body }),

  delete: <T>(endpoint: string, opts?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiFetch<T>(endpoint, { ...opts, method: "DELETE" }),
};

// ─────────────────────────────────────────────
// Guards utilitarios para componentes
// ─────────────────────────────────────────────

export const isAuthError = (e: ApiError | null) => e?.status === 401 || e?.status === 403;
export const isNotFound = (e: ApiError | null) => e?.status === 404;
export const isValidationError = (e: ApiError | null) => e?.status === 422;
export const isServerError = (e: ApiError | null) => (e?.status ?? 0) >= 500;
