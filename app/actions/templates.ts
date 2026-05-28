"use server";

import { fetchApi } from "@/lib/api-client";

export interface ProjectTemplateSummary {
  id: string;
  name: string;
  description?: string;
  industryType: string;
  isActive: boolean;
  _count?: {
    defaultStages: number;
  };
}

export interface DefaultCheckpointSummary {
  id: string;
  title: string;
  description?: string;
  standardReference?: string;
}

export interface DefaultStageSummary {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  defaultCheckpoints: DefaultCheckpointSummary[];
}

export interface ProjectTemplateDetail extends ProjectTemplateSummary {
  defaultStages: DefaultStageSummary[];
}

export async function getTemplates(): Promise<ProjectTemplateSummary[]> {
  try {
    return await fetchApi("/api/templates");
  } catch {
    return [];
  }
}

export async function getTemplateDetails(
  templateId: string
): Promise<ProjectTemplateDetail | null> {
  try {
    return await fetchApi(`/api/templates/${templateId}`);
  } catch {
    return null;
  }
}
