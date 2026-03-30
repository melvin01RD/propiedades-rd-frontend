/**
 * src/services/properties.ts
 * CRUD y búsqueda de propiedades
 */

import { apiFetch } from "@/lib/api";
import type {
  ApiResponse,
  PropertyPageResponse,
  PropertyResponse,
  PropertyCreate,
  PropertyUpdate,
  PropertyFilters,
} from "@/lib/api";

export async function getProperties(
  filters?: PropertyFilters
): Promise<ApiResponse<PropertyPageResponse>> {
  const params = new URLSearchParams();

  if (filters) {
    const { amenity_slugs, ...rest } = filters;
    for (const [key, value] of Object.entries(rest)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
    if (amenity_slugs?.length) {
      amenity_slugs.forEach((slug) => params.append("amenity_slugs", slug));
    }
  }

  const query = params.toString();
  return apiFetch<PropertyPageResponse>(`/properties${query ? `?${query}` : ""}`);
}

export async function getProperty(
  id: string
): Promise<ApiResponse<PropertyResponse>> {
  return apiFetch<PropertyResponse>(`/properties/${id}`);
}

export async function createProperty(
  data: PropertyCreate
): Promise<ApiResponse<PropertyResponse>> {
  return apiFetch<PropertyResponse>("/properties", {
    method: "POST",
    body: data,
  });
}

export async function updateProperty(
  id: string,
  data: PropertyUpdate
): Promise<ApiResponse<PropertyResponse>> {
  return apiFetch<PropertyResponse>(`/properties/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteProperty(
  id: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/properties/${id}`, { method: "DELETE" });
}
