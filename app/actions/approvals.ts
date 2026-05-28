"use server";

import { fetchApi } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export type ApprovalState = {
  success?: boolean;
  error?: string;
} | undefined;

export async function getStageApproval(stageId: string) {
  try {
    return await fetchApi(`/api/stages/${stageId}/approval`);
  } catch {
    return null;
  }
}

export async function approveStage(
  projectId: string,
  stageId: string
): Promise<ApprovalState> {
  try {
    await fetchApi(`/api/stages/${stageId}/approval/approve`, {
      method: "POST",
    });
    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to approve stage.",
    };
  }
}

export async function rejectStage(
  projectId: string,
  stageId: string,
  _state: ApprovalState,
  formData: FormData
): Promise<ApprovalState> {
  const comments = (formData.get("comments") as string) || undefined;

  try {
    await fetchApi(`/api/stages/${stageId}/approval/reject`, {
      method: "POST",
      body: JSON.stringify({ comments }),
    });
    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    revalidatePath(`/dashboard/projects/${projectId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to reject stage.",
    };
  }
}
