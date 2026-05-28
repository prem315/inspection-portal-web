import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Layers,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Wind,
  Sun,
  Droplets,
  Flame,
  Zap,
  Factory,
  Building,
  MapPin,
  Play
} from "lucide-react";
import { getProject, getProjectDashboard } from "@/app/actions/projects";
import { getProjectStages } from "@/app/actions/stages";
import { getCheckpoints } from "@/app/actions/checkpoints";
import { getStageInspectionRequests } from "@/app/actions/inspections";
import { getUserRole, isAuthenticated } from "@/lib/session";
import ProjectNav from "@/components/dashboard/ProjectNav";
import UnifiedProjectWorkbench from "@/components/dashboard/UnifiedProjectWorkbench";

function getIndustryIcon(type: string) {
  switch (type?.toUpperCase()) {
    case "WIND":
      return Wind;
    case "SOLAR":
      return Sun;
    case "HYDRO":
      return Droplets;
    case "OIL_GAS":
      return Flame;
    case "POWER_TRANSMISSION":
      return Zap;
    case "INDUSTRIAL_PLANT":
      return Factory;
    default:
      return Building;
  }
}

function getIndustryStyle(type: string) {
  switch (type?.toUpperCase()) {
    case "WIND":
      return "bg-cyan-50 text-cyan-700 border border-cyan-200/50";
    case "SOLAR":
      return "bg-amber-50 text-amber-700 border border-amber-200/50";
    case "HYDRO":
      return "bg-sky-50 text-sky-700 border border-sky-200/50";
    case "OIL_GAS":
      return "bg-orange-50 text-orange-700 border border-orange-200/50";
    case "POWER_TRANSMISSION":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200/50";
    case "INDUSTRIAL_PLANT":
      return "bg-purple-50 text-purple-700 border border-purple-200/50";
    default:
      return "bg-muted text-muted-foreground border border-border/50";
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, dashboard, role, authenticated, stages] = await Promise.all([
    getProject(id),
    getProjectDashboard(id),
    getUserRole(),
    isAuthenticated(),
    getProjectStages(id),
  ]);

  if (!project) notFound();

  const IndustryIcon = getIndustryIcon(project.industryType);
  const industryStyle = getIndustryStyle(project.industryType);

  // Load checkpoints and requests in parallel for all stages
  const stagesWithDetails = await Promise.all(
    stages.map(async (stage: any) => {
      const [checkpoints, requests] = await Promise.all([
        getCheckpoints(stage.id),
        getStageInspectionRequests(stage.id),
      ]);
      return {
        ...stage,
        checkpoints,
        requests,
      };
    })
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All projects
        </Link>
        
        <div className="flex items-center gap-4 mt-2">
          {/* Industry Icon Box */}
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${industryStyle}`}>
            <IndustryIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {project.name}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/80">
                {project.industryType?.replace(/_/g, " ")}
              </span>
              {project.location && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {project.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <ProjectNav projectId={id} userRole={role || "EPC_ENGINEER"} />
        </div>
      </div>

      {dashboard && (
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Total stages"
            value={dashboard.metrics.totalStages}
            icon={Layers}
            themeStyle="text-indigo-600 bg-indigo-50 border-indigo-100"
          />
          <MetricCard
            label="Completed stages"
            value={dashboard.metrics.completedStages}
            icon={CheckCircle2}
            themeStyle="text-emerald-600 bg-emerald-50 border-emerald-100"
          />
          <MetricCard
            label="Pending stages"
            value={dashboard.metrics.pendingStages}
            icon={Clock}
            themeStyle="text-amber-600 bg-amber-50 border-amber-100"
          />
        </div>
      )}

      {stagesWithDetails.length > 0 ? (
        <UnifiedProjectWorkbench
          projectId={id}
          stages={stagesWithDetails}
          currentUserRole={role || "EPC_ENGINEER"}
          isAuthenticated={authenticated}
          project={project}
        />
      ) : (
        <p className="text-sm text-muted-foreground text-center py-12 bg-white rounded-2xl border border-border">
          No stages configured yet.
          {role === "OWNER" && (
            <>
              {" "}
              <Link href="/setup" className="text-primary font-semibold hover:underline">
                Run setup
              </Link>{" "}
              to seed stages.
            </>
          )}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  themeStyle,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  themeStyle: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-white shadow-sm flex items-center justify-between group hover:border-primary/20 hover:shadow-md transition-all duration-200">
      <div className="space-y-1">
        <p className="text-2xl font-extrabold text-foreground tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground font-semibold">{label}</p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${themeStyle} transition-transform duration-300 group-hover:scale-105`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
