/**
 * src/services/owners.ts
 * Perfil de propietario (role: "owner")
 */

import { apiFetch } from "@/lib/api";
import type {
  ApiResponse,
  OwnerProfileResponse,
  OwnerProfileCreate,
  OwnerProfileUpdate,
} from "@/lib/api";

export async function getMyOwnerProfile(): Promise<
  ApiResponse<OwnerProfileResponse>
> {
  return apiFetch<OwnerProfileResponse>("/owners/me");
}

export async function createOwnerProfile(
  data: OwnerProfileCreate
): Promise<ApiResponse<OwnerProfileResponse>> {
  return apiFetch<OwnerProfileResponse>("/owners/me", {
    method: "POST",
    body: data,
  });
}

export async function updateOwnerProfile(
  data: OwnerProfileUpdate
): Promise<ApiResponse<OwnerProfileResponse>> {
  return apiFetch<OwnerProfileResponse>("/owners/me", {
    method: "PUT",
    body: data,
  });
}
