"use server";

import { fetchApi } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export async function getEvidence(checkpointId: string) {
  try {
    return await fetchApi(`/api/checkpoints/${checkpointId}/evidence`);
  } catch {
    return [];
  }
}

export async function getEvidenceDetail(evidenceId: string) {
  try {
    return await fetchApi(`/api/evidence/${evidenceId}`);
  } catch {
    return null;
  }
}

export async function getPresignedUrl(fileName: string, mimeType: string) {
  return fetchApi("/api/upload/presign", {
    method: "POST",
    body: JSON.stringify({ fileName, mimeType }),
  });
}

export async function createEvidence(
  projectId: string,
  stageId: string,
  checkpointId: string,
  payload: {
    type: "PHOTO" | "DOCUMENT";
    fileUrl: string;
    fileName?: string;
    fileSizeBytes?: number;
    mimeType?: string;
    notes?: string;
    inspectionRequestId?: string;
  }
) {
  try {
    await fetchApi(`/api/checkpoints/${checkpointId}/evidence`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save evidence.",
    };
  }
}
