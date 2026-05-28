"use server";

import { fetchApi } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type InspectionRequestState = {
  success?: boolean;
  error?: string;
  request?: {
    id: string;
    token: string;
    status: string;
    inspectorId: string;
  };
} | undefined;

export async function getStageInspectionRequests(stageId: string) {
  try {
    return await fetchApi(`/api/stages/${stageId}/inspection-requests`);
  } catch {
    return [];
  }
}

export async function getInspectionRequest(requestId: string) {
  try {
    return await fetchApi(`/api/inspection-requests/${requestId}`);
  } catch {
    return null;
  }
}

export async function createInspectionRequest(
  projectId: string,
  stageId: string,
  _state: InspectionRequestState,
  formData: FormData
): Promise<InspectionRequestState> {
  const inspectorEmail = formData.get("inspectorEmail") as string;
  const deadlineStart = formData.get("deadlineStart") as string;
  const deadlineEnd = formData.get("deadlineEnd") as string;

  if (!inspectorEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inspectorEmail)) {
    return { error: "Please provide a valid inspector email address." };
  }

  try {
    const request = await fetchApi(`/api/stages/${stageId}/inspection-requests`, {
      method: "POST",
      body: JSON.stringify({
        inspectorEmail,
        ...(deadlineStart && {
          deadlineStart: new Date(deadlineStart).toISOString(),
        }),
        ...(deadlineEnd && {
          deadlineEnd: new Date(deadlineEnd).toISOString(),
        }),
      }),
    });

    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/dashboard/projects/${projectId}/stages`);
    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    return {
      success: true,
      request: {
        id: request.id,
        token: request.token,
        status: request.status,
        inspectorId: request.inspectorId,
      },
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to create inspection request.",
    };
  }
}

export async function resolveInspectionToken(token: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/inspection-requests/token/${token}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function acceptInspectionByToken(token: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/inspection-requests/token/${token}/accept`,
      { method: "POST" }
    );
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message;
      return { error: message || "Failed to accept request." };
    }
    return { success: true, data: await response.json() };
  } catch {
    return { error: "Unable to connect to the server." };
  }
}

export async function rejectInspectionByToken(token: string, reason: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/inspection-requests/token/${token}/reject`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      }
    );
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message;
      return { error: message || "Failed to reject request." };
    }
    return { success: true };
  } catch {
    return { error: "Unable to connect to the server." };
  }
}

export async function markInspectionVisited(
  projectId: string,
  stageId: string,
  requestId: string
) {
  try {
    await fetchApi(`/api/inspection-requests/${requestId}/mark-visited`, {
      method: "POST",
    });
    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to mark visit.",
    };
  }
}

export async function submitInspection(
  projectId: string,
  stageId: string,
  requestId: string
) {
  try {
    await fetchApi(`/api/inspection-requests/${requestId}/submit`, {
      method: "POST",
    });
    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to submit inspection.",
    };
  }
}
