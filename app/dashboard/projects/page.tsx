import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  Wind,
  Sun,
  Droplets,
  Flame,
  Zap,
  Factory,
  Building,
  MapPin,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/app/actions/projects";
import { getUserRole } from "@/lib/session";

function getIndustryIcon(type: string) {
  switch (type.toUpperCase()) {
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
  switch (type.toUpperCase()) {
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

function getStatusBadgeStyle(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
    case "ONGOING":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "COMPLETED":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-muted text-muted-foreground border border-border";
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();
  const role = await getUserRole();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
              <FolderKanban className="h-3 w-3" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Projects
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Your projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Open a project to manage stages, checkpoints, and inspections.
          </p>
        </div>
        {role === "OWNER" && (
          <Button asChild size="sm" className="bg-primary text-white gap-1.5 rounded-xl cursor-pointer">
            <Link href="/setup">
              <Plus className="h-4 w-4" />
              Create project
            </Link>
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <FolderKanban className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-semibold">No projects yet</p>
          {role === "OWNER" && (
            <Button asChild className="mt-4 bg-primary text-white">
              <Link href="/setup">Create project</Link>
            </Button>
          )}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {projects.map(
            (project: {
              id: string;
              name: string;
              industryType: string;
              status: string;
              location?: string;
            }) => {
              const IndustryIcon = getIndustryIcon(project.industryType);
              const industryStyle = getIndustryStyle(project.industryType);
              const statusStyle = getStatusBadgeStyle(project.status);

              return (
                <li key={project.id}>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="block p-5 rounded-2xl border border-border bg-white hover:border-primary/40 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Left: Industry Icon Box */}
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${industryStyle}`}>
                        <IndustryIcon className="h-6 w-6" />
                      </div>

                      {/* Right: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {project.name}
                          </h2>
                          <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0 ${statusStyle}`}>
                            {project.status}
                          </span>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground/80">
                            {project.industryType.replace(/_/g, " ")}
                          </span>
                          {project.location && (
                            <>
                              <span className="text-border">•</span>
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground/85" />
                                {project.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-muted/50 mt-4 pt-3 text-xs font-bold text-primary">
                      <span>Open project</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
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
