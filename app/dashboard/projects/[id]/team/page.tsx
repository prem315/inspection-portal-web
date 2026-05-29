import { notFound } from "next/navigation";
import { getProject, getProjectAssignments } from "@/app/actions/projects";
import { getProjectInvitations } from "@/app/actions/invitations";
import { getUserRole } from "@/lib/session";
import TeamManagement from "./team-management";

export default async function ProjectTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const role = await getUserRole();
  const isOwnerOrAdmin = role === "OWNER" || role === "SUPER_ADMIN";

  const [assignments, invitations] = await Promise.all([
    isOwnerOrAdmin
      ? getProjectAssignments(id)
      : Promise.resolve(project.assignments || []),
    isOwnerOrAdmin ? getProjectInvitations(id) : Promise.resolve([]),
  ]);

  return (
    <TeamManagement
      projectId={id}
      currentUserRole={role || "EPC_ENGINEER"}
      initialAssignments={assignments}
      initialInvitations={invitations}
    />
  );
}
