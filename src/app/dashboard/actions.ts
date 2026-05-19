"use server";

import { revalidatePath } from "next/cache";
import { updateProperty } from "@/services/properties";
import type { PropertyStatus } from "@/lib/api";

export async function togglePropertyStatusAction(
  formData: FormData
): Promise<void> {
  const propertyId = formData.get("propertyId") as string;
  const currentStatus = formData.get("currentStatus") as PropertyStatus;
  const newStatus: PropertyStatus =
    currentStatus === "active" ? "inactive" : "active";

  await updateProperty(propertyId, { status: newStatus });
  revalidatePath("/dashboard");
}
