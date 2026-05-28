"use server";

import { fetchApi } from "@/lib/api-client";
import type {
  IndustryType,
  ProjectAssignment,
  ProjectSummary,
} from "@/lib/types";
import { revalidatePath } from "next/cache";

export type CreateProjectState = {
  error?: string;
  project?: ProjectSummary;
} | undefined;

export async function createProject(
  _state: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || undefined;
  const location = (formData.get("location") as string) || undefined;
  const industryType = formData.get("industryType") as IndustryType;
  const templateId = (formData.get("templateId") as string) || undefined;
  const startDate = (formData.get("startDate") as string) || undefined;
  const endDate = (formData.get("endDate") as string) || undefined;

  if (!name || (!templateId && !industryType)) {
    return { error: "Project name and template or industry type are required." };
  }

  try {
    const payload: any = {
      name,
      description,
      location,
      ...(startDate && { startDate: new Date(startDate).toISOString() }),
      ...(endDate && { endDate: new Date(endDate).toISOString() }),
    };

    if (templateId) {
      payload.templateId = templateId;
    } else {
      payload.industryType = industryType;
    }

    const project = await fetchApi("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    revalidatePath("/setup");
    revalidatePath("/dashboard/projects");
    return { project };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create project.",
    };
  }
}

export type AssignUserState = {
  error?: string;
  assignment?: ProjectAssignment;
} | undefined;

export async function assignUserToProject(
  projectId: string,
  _state: AssignUserState,
  formData: FormData
): Promise<AssignUserState> {
  const userId = formData.get("userId") as string;
  const assignedRole = formData.get("assignedRole") as "EPC_ENGINEER" | "INSPECTOR";

  if (!userId || !assignedRole) {
    return { error: "User and role are required." };
  }

  try {
    const assignment = await fetchApi(`/api/projects/${projectId}/assignments`, {
      method: "POST",
      body: JSON.stringify({ userId, assignedRole }),
    });

    revalidatePath("/setup");
    return { assignment };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to assign user to project.",
    };
  }
}

export async function getProjectAssignments(projectId: string) {
  try {
    return await fetchApi(`/api/projects/${projectId}/assignments`);
  } catch {
    return [];
  }
}

export async function getProjects() {
  try {
    return await fetchApi("/api/projects");
  } catch {
    return [];
  }
}

export async function getProject(id: string) {
  try {
    return await fetchApi(`/api/projects/${id}`);
  } catch {
    return null;
  }
}

export async function getProjectDashboard(id: string) {
  try {
    return await fetchApi(`/api/projects/${id}/dashboard`);
  } catch {
    return null;
  }
}
