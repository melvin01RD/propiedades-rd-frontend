"use server";

import { revalidatePath } from "next/cache";
import { addFavorite, removeFavorite, checkFavorite } from "@/services/favorites";

export async function checkFavoriteAction(propertyId: string): Promise<boolean> {
  try {
    return await checkFavorite(propertyId);
  } catch {
    return false;
  }
}

export async function toggleFavoriteAction(
  propertyId: string,
  currentIsFavorite: boolean
): Promise<{ success: boolean; isFavorite: boolean }> {
  try {
    if (currentIsFavorite) {
      const { error } = await removeFavorite(propertyId);
      return { success: !error, isFavorite: !!error };
    } else {
      const { error } = await addFavorite(propertyId);
      return { success: !error, isFavorite: !error };
    }
  } catch {
    return { success: false, isFavorite: currentIsFavorite };
  }
}

export async function removeFavoriteAction(propertyId: string): Promise<void> {
  await removeFavorite(propertyId);
  revalidatePath("/favoritos");
}
