/**
 * src/app/api/auth/logout/route.ts
 *
 * Route Handler — POST /api/auth/logout
 *
 * PROPÓSITO:
 *   Invalida la sesión tanto en el backend como en el cliente.
 *   Limpia la cookie httpOnly para que el middleware bloquee
 *   el acceso a rutas protegidas en la próxima request.
 *
 * FLUJO:
 *   Client Component → POST /api/auth/logout (este archivo)
 *     → POST http://localhost:8000/auth/logout (FastAPI — best-effort)
 *     → cookie "access_token" eliminada
 *     → responde 200 OK
 *
 * NOTA SOBRE "BEST-EFFORT":
 *   Si el backend falla o el token ya expiró, igual limpiamos la cookie.
 *   El logout del punto de vista del usuario SIEMPRE debe funcionar.
 *   No tiene sentido bloquear el logout por un error de red.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  // 1. Leer el access_token actual para enviarlo al backend
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  // 2. Notificar al backend para invalidar el token (best-effort)
  if (accessToken) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      // Ignorar errores de red — igual procedemos con el logout local
      console.warn("[/api/auth/logout] No se pudo contactar el backend:", error);
    }
  }

  // 3. Construir respuesta y eliminar la cookie
  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // maxAge: 0 elimina la cookie inmediatamente
    path: "/",
  });

  return response;
}
