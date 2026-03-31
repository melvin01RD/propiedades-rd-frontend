/**
 * src/app/api/auth/login/route.ts
 *
 * Route Handler — POST /api/auth/login
 *
 * PROPÓSITO:
 *   Puente entre Client Components y el backend FastAPI.
 *   Recibe credenciales, llama al backend, y si es exitoso
 *   guarda el access_token en una cookie httpOnly para que
 *   el middleware y los Server Components puedan leerlo.
 *
 * FLUJO:
 *   Client Component → POST /api/auth/login (este archivo)
 *     → POST http://localhost:8000/auth/login (FastAPI)
 *     → acceso_token guardado en cookie httpOnly
 *     → responde con los datos del usuario (sin token en body)
 *
 * POR QUÉ NO LLAMAR AL BACKEND DIRECTAMENTE DESDE EL CLIENTE:
 *   - Si el cliente hiciera fetch directo a FastAPI, el access_token
 *     quedaría expuesto en localStorage o en el estado del componente.
 *   - Este handler actúa como proxy seguro: el token nunca toca JS del cliente.
 */

import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Duración de la cookie en segundos — 30 minutos, alineado con el backend */
const ACCESS_TOKEN_MAX_AGE = 60 * 30;

export async function POST(req: NextRequest) {
  try {
    // 1. Leer credenciales enviadas por el Client Component
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { detail: "Email y contraseña son requeridos." },
        { status: 400 }
      );
    }

    // 2. Llamar al backend FastAPI
    // El backend espera application/x-www-form-urlencoded para OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append("username", email); // FastAPI OAuth2 usa el campo "username"
    formData.append("password", password);

    const backendRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await backendRes.json();

    // 3. Si el backend rechaza, reenviar su error tal cual
    if (!backendRes.ok) {
      return NextResponse.json(
        { detail: data.detail ?? "Credenciales inválidas." },
        { status: backendRes.status }
      );
    }

    // 4. Construir respuesta — NO incluir el access_token en el body
    //    El cliente solo necesita saber que el login fue exitoso y recibir
    //    los datos del usuario para el estado de sesión.
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // 5. Guardar el access_token en cookie httpOnly
    //    - httpOnly: JS del cliente NO puede leerla (protección XSS)
    //    - secure: solo HTTPS en producción
    //    - sameSite: "lax" permite redirecciones normales de formularios
    //    - path "/": disponible en todas las rutas
    response.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[/api/auth/login] Error inesperado:", error);
    return NextResponse.json(
      { detail: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
