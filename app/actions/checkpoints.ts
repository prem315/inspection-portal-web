"use server";

import { fetchApi } from "@/lib/api-client";
import type { CheckpointResult } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type CheckpointActionState = {
  success?: boolean;
  error?: string;
} | undefined;

export async function getCheckpoints(stageId: string) {
  try {
    return await fetchApi(`/api/stages/${stageId}/checkpoints`);
  } catch {
    return [];
  }
}

export async function createCheckpoint(
  projectId: string,
  stageId: string,
  _state: CheckpointActionState,
  formData: FormData
): Promise<CheckpointActionState> {
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || undefined;
  const standardReference =
    (formData.get("standardReference") as string) || undefined;

  if (!title) {
    return { error: "Checkpoint title is required." };
  }

  try {
    await fetchApi(`/api/stages/${stageId}/checkpoints`, {
      method: "POST",
      body: JSON.stringify({ title, description, standardReference }),
    });

    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create checkpoint.",
    };
  }
}

export async function updateCheckpointResult(
  projectId: string,
  stageId: string,
  checkpointId: string,
  result: CheckpointResult,
  notes = ""
) {
  try {
    await fetchApi(`/api/stages/${stageId}/checkpoints/${checkpointId}`, {
      method: "PATCH",
      body: JSON.stringify({ result, notes: notes || undefined }),
    });

    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    return { success: true };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to update checkpoint.",
    };
  }
}

export async function deleteCheckpoint(
  projectId: string,
  stageId: string,
  checkpointId: string
) {
  try {
    await fetchApi(`/api/stages/${stageId}/checkpoints/${checkpointId}`, {
      method: "DELETE",
    });
    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete checkpoint.",
    };
  }
}
