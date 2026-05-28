import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectAssignments } from "@/app/actions/projects";
import { getProjectInvitations } from "@/app/actions/invitations";
import { getUserRole } from "@/lib/session";
import ProjectNav from "@/components/dashboard/ProjectNav";
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
    isOwnerOrAdmin ? getProjectAssignments(id) : Promise.resolve(project.assignments || []),
    isOwnerOrAdmin ? getProjectInvitations(id) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/projects/${id}`}
          className="text-xs font-semibold text-muted-foreground hover:text-primary"
        >
          ← {project.name}
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Project Team</h1>
        <div className="mt-4">
          <ProjectNav projectId={id} />
        </div>
      </div>

      <TeamManagement
        projectId={id}
        currentUserRole={role || "EPC_ENGINEER"}
        initialAssignments={assignments}
        initialInvitations={invitations}
      />
    </div>
  );
}
