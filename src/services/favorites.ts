/**
 * src/services/favorites.ts
 * Guardar y eliminar propiedades favoritas
 */

import { apiFetch } from "@/lib/api";
import type { ApiResponse, FavoriteResponse } from "@/lib/api";

export async function getFavorites(): Promise<ApiResponse<FavoriteResponse[]>> {
  return apiFetch<FavoriteResponse[]>("/favorites");
}

export async function addFavorite(
  propertyId: string
): Promise<ApiResponse<FavoriteResponse>> {
  return apiFetch<FavoriteResponse>(`/favorites/${propertyId}`, {
    method: "POST",
  });
}

export async function removeFavorite(
  propertyId: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/favorites/${propertyId}`, { method: "DELETE" });
}

export async function checkFavorite(propertyId: string): Promise<boolean> {
  const { data } = await getFavorites();
  if (!data) return false;
  return data.some((f) => f.property_id === propertyId);
}
