/**
 * src/services/alerts.ts
 * Gestión de alertas de búsqueda del usuario autenticado
 */

import { apiFetch } from "@/lib/api";
import type {
  ApiResponse,
  AlertResponse,
  AlertCreate,
  AlertUpdate,
} from "@/lib/api";

export async function getAlerts(): Promise<ApiResponse<AlertResponse[]>> {
  return apiFetch<AlertResponse[]>("/alerts");
}

export async function createAlert(
  data: AlertCreate
): Promise<ApiResponse<AlertResponse>> {
  return apiFetch<AlertResponse>("/alerts", { method: "POST", body: data });
}

export async function updateAlert(
  id: string,
  data: AlertUpdate
): Promise<ApiResponse<AlertResponse>> {
  return apiFetch<AlertResponse>(`/alerts/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteAlert(
  id: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/alerts/${id}`, { method: "DELETE" });
}
