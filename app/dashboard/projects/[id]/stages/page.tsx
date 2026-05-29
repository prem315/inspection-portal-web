import { notFound } from "next/navigation";
import { getProject } from "@/app/actions/projects";
import { getProjectStages } from "@/app/actions/stages";
import { getCheckpoints } from "@/app/actions/checkpoints";
import { getStageInspectionRequests } from "@/app/actions/inspections";
import { getUserRole, isAuthenticated } from "@/lib/session";
import CreateStageModal from "@/components/dashboard/CreateStageModal";
import StagesDashboard from "@/components/dashboard/StagesDashboard";

export default async function ProjectStagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, stages, role, authenticated] = await Promise.all([
    getProject(id),
    getProjectStages(id),
    getUserRole(),
    isAuthenticated(),
  ]);

  if (!project) notFound();

  // Preload checkpoints + requests for all stages in parallel
  const stagesWithDetails = await Promise.all(
    stages.map(async (stage: any) => {
      const [checkpoints, requests] = await Promise.all([
        getCheckpoints(stage.id),
        getStageInspectionRequests(stage.id),
      ]);
      return { ...stage, checkpoints, requests };
    })
  );

  return (
    <div className="space-y-4">
      {/* Create stage action (Owner only) */}
      {role === "OWNER" && (
        <div className="flex justify-end">
          <CreateStageModal
            projectId={id}
            defaultDisplayOrder={stages.length + 1}
          />
        </div>
      )}

      <StagesDashboard
        projectId={id}
        stages={stagesWithDetails}
        currentUserRole={role || "EPC_ENGINEER"}
        isAuthenticated={authenticated}
        project={project}
      />
    </div>
  );
}
