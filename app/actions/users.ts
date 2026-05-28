"use server";

import { fetchApi } from "@/lib/api-client";
import type { AssignedRole, ProvisionedUser } from "@/lib/types";

export type ProvisionUserState = {
  error?: string;
  user?: ProvisionedUser;
} | undefined;

export async function provisionTeamMember(
  _state: ProvisionUserState,
  formData: FormData
): Promise<ProvisionUserState> {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as AssignedRole;
  const phone = (formData.get("phone") as string) || undefined;

  if (!email || !name || !role) {
    return { error: "Name, email, and role are required." };
  }

  if (role !== "EPC_ENGINEER" && role !== "INSPECTOR") {
    return { error: "Role must be EPC Engineer or Inspector." };
  }

  try {
    const data = await fetchApi("/api/users", {
      method: "POST",
      body: JSON.stringify({ email, name, role, phone }),
    });

    return {
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        tempPassword: data.tempPassword,
      },
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create user.",
    };
  }
}
