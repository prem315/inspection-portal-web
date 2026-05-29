import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Wind, Sun, Droplets, Flame, Zap, Factory, Building, MapPin, ArrowLeft,
} from "lucide-react";
import { getProject } from "@/app/actions/projects";
import { getUserRole } from "@/lib/session";
import ProjectNav from "@/components/dashboard/ProjectNav";

function getIndustryIcon(type: string) {
  switch (type?.toUpperCase()) {
    case "WIND": return Wind;
    case "SOLAR": return Sun;
    case "HYDRO": return Droplets;
    case "OIL_GAS": return Flame;
    case "POWER_TRANSMISSION": return Zap;
    case "INDUSTRIAL_PLANT": return Factory;
    default: return Building;
  }
}

function getIndustryStyle(type: string) {
  switch (type?.toUpperCase()) {
    case "WIND": return "bg-cyan-50 text-cyan-700 border-cyan-200";
    case "SOLAR": return "bg-amber-50 text-amber-700 border-amber-200";
    case "HYDRO": return "bg-sky-50 text-sky-700 border-sky-200";
    case "OIL_GAS": return "bg-orange-50 text-orange-700 border-orange-200";
    case "POWER_TRANSMISSION": return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "INDUSTRIAL_PLANT": return "bg-purple-50 text-purple-700 border-purple-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, role] = await Promise.all([getProject(id), getUserRole()]);

  if (!project) notFound();

  const IndustryIcon = getIndustryIcon(project.industryType);
  const industryStyle = getIndustryStyle(project.industryType);

  return (
    <div className="space-y-0">
      {/* ── Shared project header ── */}
      <div className="space-y-3 pb-0">
        {/* Back link */}
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          All projects
        </Link>

        {/* Project identity */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 border ${industryStyle}`}
          >
            <IndustryIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                {project.name}
              </h1>
              <span
                className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                  project.status === "IN_PROGRESS" || project.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {(project.status || "Active").replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span className="font-medium">{project.industryType?.replace(/_/g, " ")}</span>
              {project.location && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3" />
                    {project.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <ProjectNav projectId={id} userRole={role || "EPC_ENGINEER"} />
      </div>

      {/* ── Page content ── */}
      <div className="pt-4">
        {children}
      </div>
    </div>
  );
}
