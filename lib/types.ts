export type UserRole = "OWNER" | "EPC_ENGINEER" | "INSPECTOR" | "SUPER_ADMIN";
export type AssignedRole = "EPC_ENGINEER" | "INSPECTOR";
export type IndustryType =
  | "WIND"
  | "SOLAR"
  | "HYDRO"
  | "OIL_GAS"
  | "POWER_TRANSMISSION"
  | "INDUSTRIAL_PLANT"
  | "OTHER";

export interface ProvisionedUser {
  id: string;
  name: string;
  email: string;
  role: AssignedRole;
  tempPassword?: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  location?: string;
  industryType: IndustryType;
  status: string;
  createdAt: string;
}

export interface ProjectAssignment {
  id: string;
  projectId: string;
  userId: string;
  assignedRole: AssignedRole;
  createdAt: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  status: string;
  projectId: string;
}

export type CheckpointResult = "PENDING" | "PASS" | "FAIL" | "NA";

export interface Checkpoint {
  id: string;
  stageId: string;
  title: string;
  description?: string;
  result: CheckpointResult;
  notes?: string;
  isCritical?: boolean;
}

export interface InspectionRequest {
  id: string;
  stageId: string;
  status: string;
  token: string;
  inspectorId: string;
  deadlineStart?: string;
  deadlineEnd?: string;
  inspector?: { id: string; name: string; email: string };
}

export interface ProjectDashboard {
  projectId: string;
  name: string;
  status: string;
  industryType: string;
  location?: string;
  metrics: {
    totalStages: number;
    completedStages: number;
    pendingStages: number;
  };
  stages: Array<{
    stageId: string;
    name: string;
    status: string;
    displayOrder: number;
    checkpointsCount: number;
    passedCheckpointsCount: number;
    failedCheckpointsCount: number;
    pendingCheckpointsCount: number;
  }>;
}
