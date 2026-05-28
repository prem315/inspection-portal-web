"use server";

import { fetchApi } from "@/lib/api-client";
import { revalidatePath } from "next/cache";

export type StageActionState = {
  error?: string;
  success?: boolean;
  count?: number;
  stage?: { id: string; name: string; displayOrder?: number; orderIndex?: number };
} | undefined;

export async function seedProjectStages(
  projectId: string
): Promise<StageActionState> {
  try {
    const result = await fetchApi(`/api/projects/${projectId}/stages/seed`, {
      method: "POST",
    });
    revalidatePath("/setup");
    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/dashboard/projects/${projectId}/stages`);
    return { success: true, count: result?.count };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to seed stages.",
    };
  }
}

export async function createCustomStage(
  projectId: string,
  _state: StageActionState,
  formData: FormData
): Promise<StageActionState> {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || undefined;
  const displayOrder = Number(formData.get("displayOrder") || 1);

  if (!name) {
    return { error: "Stage name is required." };
  }

  try {
    const stage = await fetchApi(`/api/projects/${projectId}/stages`, {
      method: "POST",
      body: JSON.stringify({ name, description, displayOrder }),
    });
    revalidatePath("/setup");
    revalidatePath(`/dashboard/projects/${projectId}/stages`);
    return { success: true, stage };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create stage.",
    };
  }
}

export async function updateProjectStage(
  projectId: string,
  stageId: string,
  formData: FormData
): Promise<StageActionState> {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || undefined;
  const displayOrder = Number(formData.get("displayOrder") || 1);

  if (!name) {
    return { error: "Stage name is required." };
  }

  try {
    const stage = await fetchApi(`/api/projects/${projectId}/stages/${stageId}`, {
      method: "PATCH",
      body: JSON.stringify({ name, description, displayOrder }),
    });
    revalidatePath("/setup");
    revalidatePath(`/dashboard/projects/${projectId}/stages`);
    revalidatePath(`/dashboard/projects/${projectId}/stages/${stageId}`);
    return { success: true, stage };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update stage.",
    };
  }
}

export async function deleteProjectStage(projectId: string, stageId: string) {
  try {
    await fetchApi(`/api/projects/${projectId}/stages/${stageId}`, {
      method: "DELETE",
    });
    revalidatePath("/setup");
    revalidatePath(`/dashboard/projects/${projectId}/stages`);
    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete stage.",
    };
  }
}

export async function getProjectStages(projectId: string) {
  try {
    return await fetchApi(`/api/projects/${projectId}/stages`);
  } catch {
    return [];
  }
}
