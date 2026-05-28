"use server";

import { fetchApi } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export type UpdateProfileState = {
  error?: string;
  success?: boolean;
} | undefined;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "EPC_ENGINEER" | "INSPECTOR" | "SUPER_ADMIN";
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  try {
    return await fetchApi("/api/users/me");
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return null;
  }
}

export async function updateUserProfile(
  _state: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!name) {
    return { error: "Name is required." };
  }

  try {
    await fetchApi("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, phone: phone || null }),
    });
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update profile.",
    };
  }
}
