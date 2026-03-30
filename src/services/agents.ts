/**
 * src/services/agents.ts
 * Perfil de agente inmobiliario (role: "agent")
 */

import { apiFetch } from "@/lib/api";
import type {
  ApiResponse,
  AgentProfileResponse,
  AgentProfileCreate,
  AgentProfileUpdate,
} from "@/lib/api";

export async function getMyAgentProfile(): Promise<
  ApiResponse<AgentProfileResponse>
> {
  return apiFetch<AgentProfileResponse>("/agents/me");
}

export async function createAgentProfile(
  data: AgentProfileCreate
): Promise<ApiResponse<AgentProfileResponse>> {
  return apiFetch<AgentProfileResponse>("/agents/me", {
    method: "POST",
    body: data,
  });
}

export async function updateAgentProfile(
  data: AgentProfileUpdate
): Promise<ApiResponse<AgentProfileResponse>> {
  return apiFetch<AgentProfileResponse>("/agents/me", {
    method: "PUT",
    body: data,
  });
}
