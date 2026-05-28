import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/app/actions/projects";
import { getProjectStages } from "@/app/actions/stages";
import { getCheckpoints } from "@/app/actions/checkpoints";
import {
  getStageInspectionRequests,
  getInspectionRequest,
} from "@/app/actions/inspections";
import { getUserRole, isAuthenticated } from "@/lib/session";
import ProjectNav from "@/components/dashboard/ProjectNav";
import CreateCheckpointForm from "@/components/dashboard/CreateCheckpointForm";
import CreateInspectionRequestModal from "@/components/dashboard/CreateInspectionRequestModal";
import CheckpointWorkbench from "@/components/dashboard/CheckpointWorkbench";
import InspectorFieldPanel from "@/components/dashboard/InspectorFieldPanel";
import StageApprovalPanel from "@/components/dashboard/StageApprovalPanel";

export default async function StageWorkbenchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; sid: string }>;
  searchParams: Promise<{ requestId?: string }>;
}) {
  const { id: projectId, sid: stageId } = await params;
  const { requestId: requestIdParam } = await searchParams;
  const [project, stages, checkpoints, requests, role, authenticated] =
    await Promise.all([
      getProject(projectId),
      getProjectStages(projectId),
      getCheckpoints(stageId),
      getStageInspectionRequests(stageId),
      getUserRole(),
      isAuthenticated(),
    ]);

  const inspectorRequest =
    role === "INSPECTOR" && requestIdParam
      ? await getInspectionRequest(requestIdParam)
      : null;

  if (!project) notFound();

  const stage = stages.find((s: { id: string }) => s.id === stageId);
  if (!stage) notFound();

  const activeRequest = (inspectorRequest ?? requests[0]) as
    | {
        id: string;
        status: string;
        token: string;
        inspectorId: string;
      }
    | undefined;

  const isEpc = role === "EPC_ENGINEER";
  const isInspector = role === "INSPECTOR";
  const isOwner = role === "OWNER";

  const canEditResults =
    isInspector &&
    !!activeRequest &&
    activeRequest.status === "IN_PROGRESS";
  const inspectorCanWork =
    isInspector &&
    activeRequest &&
    activeRequest.status !== "FAILED";

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/dashboard/projects/${projectId}/stages`}
          className="text-xs font-semibold text-muted-foreground hover:text-primary"
        >
          ← Stages
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{stage.name}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Status: <span className="font-bold text-foreground">{stage.status}</span>
        </p>
        <div className="mt-4">
          <ProjectNav projectId={projectId} stageId={stageId} userRole={role || "EPC_ENGINEER"} />
        </div>
      </div>

      {isOwner && (
        <StageApprovalPanel
          projectId={projectId}
          stageId={stageId}
          stageStatus={stage.status}
        />
      )}

      {inspectorCanWork && activeRequest && (
        <InspectorFieldPanel
          projectId={projectId}
          stageId={stageId}
          request={activeRequest}
          isAuthenticated={authenticated}
        />
      )}

      <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold">Checkpoints</h2>
          <div className="flex flex-wrap gap-2">
            {isEpc && checkpoints.length > 0 && (
              <CreateInspectionRequestModal
                projectId={projectId}
                stageId={stageId}
              />
            )}
          </div>
        </div>
        <div className="p-6 space-y-4">
          {isEpc && <CreateCheckpointForm projectId={projectId} stageId={stageId} />}
          <CheckpointWorkbench
            projectId={projectId}
            stageId={stageId}
            checkpoints={checkpoints}
            canEditResults={isEpc || !!canEditResults}
            canDelete={isEpc}
            inspectionRequestId={activeRequest?.id}
          />
        </div>
      </section>

      {activeRequest && (isEpc || isOwner) && (
        <section className="p-5 rounded-xl border border-border bg-muted/20">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Active inspection request
          </h3>
          <p className="text-sm">
            Status: <strong>{activeRequest.status}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-2 break-all">
            Inspector link: /inspect/{activeRequest.token}
          </p>
        </section>
      )}
    </div>
  );
}
