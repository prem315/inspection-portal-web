import { notFound, redirect } from "next/navigation";
import { getProject } from "@/app/actions/projects";
import { getUserRole } from "@/lib/session";
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

  return <ProjectSettingsClient projectId={id} />;
}
