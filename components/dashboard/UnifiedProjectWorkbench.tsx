"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import type { ProjectStage, Checkpoint, InspectionRequest } from "@/lib/types";

// Import existing dashboard components
import CheckpointWorkbench from "./CheckpointWorkbench";
import CreateCheckpointForm from "./CreateCheckpointForm";
import CreateInspectionRequestModal from "./CreateInspectionRequestModal";
import InspectorFieldPanel from "./InspectorFieldPanel";
import StageApprovalPanel from "./StageApprovalPanel";

interface StageWithDetails extends ProjectStage {
  checkpoints: Checkpoint[];
  requests: InspectionRequest[];
}

interface UnifiedProjectWorkbenchProps {
  projectId: string;
  stages: StageWithDetails[];
  currentUserRole: string;
  isAuthenticated: boolean;
  project: any;
}

export default function UnifiedProjectWorkbench({
  projectId,
  stages,
  currentUserRole,
  isAuthenticated,
  project,
}: UnifiedProjectWorkbenchProps) {
  // Find default expanded stage (first in-progress or submitted, else first stage)
  const defaultExpandedId = stages.find(
    (s) => s.status === "IN_PROGRESS" || s.status === "SUBMITTED"
  )?.id || stages[0]?.id || null;

  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const isEpc = currentUserRole === "EPC_ENGINEER";
  const isInspector = currentUserRole === "INSPECTOR";
  const isOwner = currentUserRole === "OWNER";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">Project Stages & Workbench</h2>
        <p className="text-xs text-muted-foreground">Click a stage to access checkpoints and inspect actions inline</p>
      </div>

      <div className="space-y-3">
        {stages.map((stage) => {
          const isExpanded = expandedId === stage.id;
          const checkpoints = stage.checkpoints || [];
          const requests = stage.requests || [];

          // Find active request
          const activeRequest = requests[0];

          const canEditResults =
            isInspector &&
            !!activeRequest &&
            activeRequest.status === "IN_PROGRESS";
          const inspectorCanWork =
            isInspector &&
            activeRequest &&
            activeRequest.status !== "FAILED";

          // Calculate progress count
          const totalCps = checkpoints.length;
          const passedCps = checkpoints.filter((cp) => cp.result === "PASS").length;

          // Status colors
          const statusColors: Record<string, string> = {
            PENDING: "bg-muted text-muted-foreground",
            IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-100",
            SUBMITTED: "bg-yellow-50 text-yellow-700 border-yellow-100",
            APPROVED: "bg-green-50 text-primary border-green-100",
            REJECTED: "bg-red-50 text-destructive border-red-100",
          };
          const badgeClass = statusColors[stage.status] || "bg-muted text-foreground";

          return (
            <div
              key={stage.id}
              className={`border border-border rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-200 ${
                isExpanded ? "ring-1 ring-primary/20 shadow-md" : ""
              }`}
            >
              {/* Header bar */}
              <button
                type="button"
                onClick={() => toggleExpand(stage.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/10 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                    {stage.status.replace("_", " ")}
                  </span>
                  <span className="font-bold text-sm text-foreground">{stage.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  {totalCps > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {passedCps}/{totalCps} Pass
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-border/40 bg-muted/5 space-y-5">
                  {stage.description && (
                    <div className="text-xs text-muted-foreground">
                      {stage.description}
                    </div>
                  )}

                  {/* Owner Approval Panel */}
                  {isOwner && (
                    <StageApprovalPanel
                      projectId={projectId}
                      stageId={stage.id}
                      stageStatus={stage.status}
                    />
                  )}

                  {/* Inspector Panel */}
                  {inspectorCanWork && activeRequest && (
                    <InspectorFieldPanel
                      projectId={projectId}
                      stageId={stage.id}
                      request={activeRequest}
                      isAuthenticated={isAuthenticated}
                    />
                  )}

                  {/* Active Inspection Request for EPC/Owner */}
                  {activeRequest && (isEpc || isOwner) && (
                    <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Active Inspection Request
                      </h4>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <div>
                          Status: <strong className="text-foreground">{activeRequest.status}</strong>
                        </div>
                        <span className="text-[10px] text-muted-foreground break-all">
                          Link: /inspect/{activeRequest.token}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Checkpoints Section */}
                  <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3 gap-4">
                      <h4 className="text-xs font-bold text-foreground">Stage Checklist</h4>
                      {isEpc && checkpoints.length > 0 && (
                        <CreateInspectionRequestModal
                          projectId={projectId}
                          stageId={stage.id}
                        />
                      )}
                    </div>

                    {isEpc && (
                      <div className="pb-2">
                        <CreateCheckpointForm projectId={projectId} stageId={stage.id} />
                      </div>
                    )}

                    <CheckpointWorkbench
                      projectId={projectId}
                      stageId={stage.id}
                      checkpoints={checkpoints}
                      canEditResults={isEpc || !!canEditResults}
                      canDelete={isEpc}
                      inspectionRequestId={activeRequest?.id}
                    />
                  </div>

                  {/* Link to Full View */}
                  <div className="flex justify-end pt-2 border-t border-border/60">
                    <Link
                      href={`/dashboard/projects/${projectId}/stages/${stage.id}`}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Open dedicated stage page
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
