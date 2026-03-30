/**
 * src/services/catalogs.ts
 * Catálogos públicos: provincias, sectores, amenidades
 */

import { apiFetch } from "@/lib/api";
import type {
  ApiResponse,
  ProvinceResponse,
  SectorResponse,
  AmenityResponse,
  AmenitiesByCategoryResponse,
} from "@/lib/api";

export async function getProvinces(): Promise<ApiResponse<ProvinceResponse[]>> {
  return apiFetch<ProvinceResponse[]>("/catalogs/provinces", { public: true });
}

export async function getSectors(
  provinceId?: number
): Promise<ApiResponse<SectorResponse[]>> {
  const query = provinceId ? `?province_id=${provinceId}` : "";
  return apiFetch<SectorResponse[]>(`/catalogs/sectors${query}`, { public: true });
}

export async function getAmenities(): Promise<ApiResponse<AmenityResponse[]>> {
  return apiFetch<AmenityResponse[]>("/catalogs/amenities", { public: true });
}

export async function getAmenitiesByCategory(): Promise<
  ApiResponse<AmenitiesByCategoryResponse[]>
> {
  return apiFetch<AmenitiesByCategoryResponse[]>(
    "/catalogs/amenities/by-category",
    { public: true }
  );
}
