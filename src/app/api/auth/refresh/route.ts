/**
 * src/app/api/auth/refresh/route.ts
 *
 * Route Handler — POST /api/auth/refresh
 *
 * PROPÓSITO:
 *   Renueva el access_token usando el refresh_token que el backend
 *   gestiona en su propia cookie httpOnly. El cliente nunca ve
 *   ni maneja el refresh_token directamente.
 *
 * FLUJO:
 *   Client Component (interceptor de 401) → POST /api/auth/refresh
 *     → POST http://localhost:8000/auth/refresh
 *       (el backend lee su refresh_token cookie automáticamente)
 *     → nuevo access_token guardado en cookie httpOnly del frontend
 *     → responde 200 OK
 *
 * CUÁNDO SE LLAMA:
 *   - Cuando lib/api.ts recibe un 401 del backend
 *   - Cuando el middleware detecta que el access_token está por vencer
 *   - Manualmente desde el cliente si se quiere forzar un refresco
 *
 * SI EL REFRESH FALLA:
 *   - Significa que el refresh_token también expiró (sesión muerta)
 *   - Se limpia la cookie de access_token
 *   - El cliente debe redirigir al usuario a /login
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Duración de la cookie en segundos — debe coincidir con el handler de login */
const ACCESS_TOKEN_MAX_AGE = 60 * 30;

export async function POST(req: NextRequest) {
  try {
    // El backend de FastAPI lee el refresh_token desde su propia cookie.
    // Necesitamos reenviar las cookies del cliente al backend para que
    // pueda leer el refresh_token correctamente.
    const incomingCookies = req.headers.get("cookie") ?? "";

    const backendRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        // Reenviar todas las cookies del cliente al backend
        // Incluye el refresh_token httpOnly que el backend necesita leer
        Cookie: incomingCookies,
        "Content-Type": "application/json",
      },
    });

    // Si el backend rechaza el refresh, la sesión está completamente muerta
    if (!backendRes.ok) {
      const response = NextResponse.json(
        { detail: "Sesión expirada. Por favor inicia sesión nuevamente." },
        { status: 401 }
      );

      // Limpiar el access_token del cliente
      response.cookies.set("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });

      return response;
    }

    const data = await backendRes.json();

    // Guardar el nuevo access_token en la cookie httpOnly
    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[/api/auth/refresh] Error inesperado:", error);
    return NextResponse.json(
      { detail: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
