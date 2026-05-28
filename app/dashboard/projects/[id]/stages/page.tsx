import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/app/actions/projects";
import { getProjectStages } from "@/app/actions/stages";
import ProjectNav from "@/components/dashboard/ProjectNav";
import { getUserRole } from "@/lib/session";
import CreateStageModal from "@/components/dashboard/CreateStageModal";
import {
  ArrowLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  Clock
} from "lucide-react";

function getStatusBadgeStyle(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-destructive border border-destructive-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "SUBMITTED":
      return "bg-yellow-50 text-yellow-800 border border-yellow-200";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

function getStatusIcon(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return CheckCircle2;
    case "REJECTED":
      return AlertTriangle;
    case "IN_PROGRESS":
      return Play;
    case "SUBMITTED":
      return FileText;
    default:
      return Clock;
  }
}

function getStatusIconColor(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return "bg-emerald-100 text-emerald-700";
    case "REJECTED":
      return "bg-red-100 text-destructive";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "SUBMITTED":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default async function ProjectStagesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const stages = await getProjectStages(id);
  const role = await getUserRole();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/projects/${id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {project.name}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Inspection stages</h1>
          </div>
          {role === "OWNER" && (
            <CreateStageModal projectId={id} defaultDisplayOrder={stages.length + 1} />
          )}
        </div>
        <div className="mt-4">
          <ProjectNav projectId={id} userRole={role || "EPC_ENGINEER"} />
        </div>
      </div>

      {stages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-border">
          <Layers className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">
            No stages on this project yet.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {stages.map(
            (stage: {
              id: string;
              name: string;
              description?: string;
              status: string;
              displayOrder: number;
            }) => {
              const StatusIcon = getStatusIcon(stage.status);
              const badgeStyle = getStatusBadgeStyle(stage.status);
              const iconColor = getStatusIconColor(stage.status);

              return (
                <li key={stage.id}>
                  <Link
                    href={`/dashboard/projects/${id}/stages/${stage.id}`}
                    className="flex items-center justify-between p-4 rounded-2xl border border-border bg-white hover:border-primary/40 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Left Status Icon */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground/90 bg-muted px-2 py-0.5 rounded-md">
                            Stage {stage.displayOrder}
                          </span>
                        </div>
                        <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mt-1 truncate">
                          {stage.name}
                        </h2>
                        {stage.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {stage.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full ${badgeStyle}`}>
                        {stage.status}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </li>
              );
            }
          )}
        </ul>
      )}
    </div>
  );
}
