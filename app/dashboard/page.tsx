import Link from "next/link";
import {
  CheckCircle2,
  FolderKanban,
  UserPlus,
  Layers,
  ArrowRight,
  Wind,
  Sun,
  Droplets,
  Flame,
  Zap,
  Factory,
  Building,
  MapPin,
  Plus,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/app/actions/projects";
import { getUserRole } from "@/lib/session";

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

export default async function DashboardPage() {
  const projects = await getProjects();
  const role = await getUserRole();

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
            <Briefcase className="h-3 w-3" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Dashboard</p>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {role === "OWNER"
            ? "Manage projects, EPC invitations, and inspection stages from your workspace."
            : "View projects you are assigned to and manage inspection work."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink
          href="/dashboard/projects"
          icon={FolderKanban}
          title="All projects"
          description="Stages, checkpoints, and inspections"
          themeStyle="text-primary bg-primary/10 border-primary/20"
        />
        {role === "OWNER" && (
          <>
            <QuickLink
              href="/setup"
              icon={UserPlus}
              title="Invite EPC"
              description="Send project invitation"
              themeStyle="text-blue-600 bg-blue-50 border-blue-100"
            />
            <QuickLink
              href="/setup"
              icon={Layers}
              title="Configure stages"
              description="Customize cloned stages"
              themeStyle="text-amber-600 bg-amber-50 border-amber-100"
            />
          </>
        )}
      </div>

      <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4.5 w-4.5 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Your projects</h2>
          </div>
          {role === "OWNER" && (
            <Button asChild size="sm" className="bg-primary text-white text-xs gap-1.5 rounded-xl cursor-pointer">
              <Link href="/setup">
                <Plus className="h-3.5 w-3.5" />
                Add via setup
              </Link>
            </Button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FolderKanban className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No projects yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {role === "OWNER"
                ? "Complete the setup wizard to create your first project and invite the EPC engineer."
                : "Ask your project owner to assign you to a project."}
            </p>
            {role === "OWNER" && (
              <Button asChild className="mt-4 bg-primary text-white">
                <Link href="/setup">Start setup wizard</Link>
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {projects.map((project: {
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
                    className="px-6 py-5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${industryStyle}`}>
                        <IndustryIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {project.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{project.industryType.replace(/_/g, " ")}</span>
                          {project.location && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {project.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full ${statusStyle}`}>
                        {project.status}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="flex items-start gap-3 p-4 rounded-2xl border border-primary/10 bg-primary/5 text-xs text-primary/90 leading-relaxed font-semibold">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <span>
          Inspection requests and evidence uploads are available to assigned EPC engineers
          and inspectors once stages are configured. Use the left sidebar to navigate between your workspace parameters.
        </span>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
  themeStyle,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  themeStyle: string;
}) {
  return (
    <Link
      href={href}
      className="p-5 rounded-2xl border border-border bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 group flex items-start justify-between"
    >
      <div className="space-y-1.5 flex-1 pr-3">
        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-xs text-muted-foreground leading-snug">{description}</p>
      </div>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${themeStyle} transition-transform duration-300 group-hover:scale-105`}>
        <Icon className="h-5 w-5" />
      </div>
    </Link>
  );
}
