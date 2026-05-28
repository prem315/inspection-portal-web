import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProject } from "@/app/actions/projects";
import ProjectNav from "@/components/dashboard/ProjectNav";
import { getUserRole } from "@/lib/session";
import { ArrowLeft, Settings } from "lucide-react";
import ProjectSettingsClient from "./ProjectSettingsClient";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const role = await getUserRole();
  if (role !== "OWNER") {
    redirect(`/dashboard/projects/${id}`);
  }

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
              <Settings className="h-3.5 w-3.5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight font-heading">Project settings</h1>
          </div>
        </div>
        <div className="mt-4">
          <ProjectNav projectId={id} userRole={role} />
        </div>
      </div>

      <ProjectSettingsClient projectId={id} />
    </div>
  );
}
