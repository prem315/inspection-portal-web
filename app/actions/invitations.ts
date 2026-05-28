"use server";

import { fetchApi } from "@/lib/api-client";
import { setSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export interface Invitation {
  id: string;
  email: string;
  role: "EPC_ENGINEER" | "INSPECTOR";
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  expiresAt: string;
  createdAt: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  email: string;
  role: "EPC_ENGINEER" | "INSPECTOR";
  projectId: string;
  projectName: string;
  expiresAt: string;
  accountExists?: boolean;
  error?: string;
}

export type CompleteInvitationState = {
  success?: boolean;
  error?: string;
  message?: string;
  projectId?: string;
  role?: "EPC_ENGINEER" | "INSPECTOR";
  accountCreated?: boolean;
} | undefined;

export async function inviteMember(
  projectId: string,
  email: string,
  role: "EPC_ENGINEER" | "INSPECTOR"
) {
  try {
    const data = await fetchApi(`/api/projects/${projectId}/invitations`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });
    revalidatePath(`/dashboard/projects/${projectId}/team`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send invitation.",
    };
  }
}

export async function getProjectInvitations(projectId: string): Promise<Invitation[]> {
  try {
    return await fetchApi(`/api/projects/${projectId}/invitations`);
  } catch (error) {
    console.error("Failed to fetch project invitations:", error);
    return [];
  }
}

export async function cancelInvitation(invitationId: string, projectId: string) {
  try {
    const data = await fetchApi(`/api/invitations/${invitationId}`, {
      method: "DELETE",
    });
    revalidatePath(`/dashboard/projects/${projectId}/team`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel invitation.",
    };
  }
}

export async function verifyInvitationToken(token: string): Promise<VerifyTokenResponse> {
  try {
    const urlEncodedToken = encodeURIComponent(token);
    return await fetchApi(`/api/invitations/verify?token=${urlEncodedToken}`);
  } catch (error) {
    return {
      valid: false,
      email: "",
      role: "EPC_ENGINEER",
      projectId: "",
      projectName: "",
      expiresAt: "",
      error: error instanceof Error ? error.message : "Invalid or expired invitation token.",
    };
  }
}

export async function registerWithInvitation(
  token: string,
  name: string,
  password: string,
  phone?: string
) {
  try {
    const data = await fetchApi(`/api/invitations/register`, {
      method: "POST",
      body: JSON.stringify({ token, name, password, phone }),
    });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed.",
    };
  }
}

export async function acceptInvitation(token: string) {
  try {
    const data = await fetchApi(`/api/invitations/accept`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Accepting invitation failed.",
    };
  }
}

function formatPublicApiError(
  errorData: { message?: string | string[]; error?: string } | null,
  status: number
) {
  if (!errorData) {
    return `API Error: ${status}`;
  }
  const { message, error } = errorData;
  if (Array.isArray(message)) {
    return message.join(", ");
  }
  return message || error || `API Error: ${status}`;
}

export async function completeInvitation(
  _state: CompleteInvitationState,
  formData: FormData
): Promise<CompleteInvitationState> {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const name = (formData.get("name") as string) || undefined;
  const phone = (formData.get("phone") as string) || undefined;
  const accountExists = formData.get("accountExists") === "true";

  if (!token) {
    return { error: "Invitation token is required." };
  }

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (!accountExists && !name) {
    return { error: "Name is required to create your account." };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/invitations/complete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          ...(name && { name }),
          ...(phone && { phone }),
        }),
      }
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      const errorData = contentType?.includes("application/json")
        ? await response.json().catch(() => null)
        : null;
      return { error: formatPublicApiError(errorData, response.status) };
    }

    const data = await response.json();
    await setSession(data.accessToken, data.refreshToken, data.user.role);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    if (data.assignment?.projectId) {
      revalidatePath(`/dashboard/projects/${data.assignment.projectId}`);
    }

    return {
      success: true,
      message:
        data.message ||
        (data.accountCreated
          ? "Account created and invitation accepted successfully"
          : "Invitation accepted successfully"),
      projectId: data.assignment?.projectId,
      role: data.user?.role,
      accountCreated: data.accountCreated,
    };
  } catch {
    return {
      error: "Unable to complete invitation. Please check your connection.",
    };
  }
}
