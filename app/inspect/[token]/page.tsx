import { notFound } from "next/navigation";
import { resolveInspectionToken } from "@/app/actions/inspections";
import InspectTokenActions from "./_components/InspectTokenActions";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function PublicInspectPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const request = await resolveInspectionToken(token);

  if (!request) notFound();

  const projectName = request.stage?.project?.name ?? "Project";
  const stageName = request.stage?.name ?? "Stage";
  const deadline = request.deadlineEnd || request.deadlineStart;

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="border-b border-border bg-white">
        <div className="container mx-auto max-w-2xl flex h-14 items-center px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold">
              Inspect<span className="text-primary">Flow</span>
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-8 text-white text-center">
            <h1 className="text-xl font-extrabold">Inspection invitation</h1>
            <p className="text-sm text-white/80 mt-2">
              You have been asked to inspect a project stage on site.
            </p>
          </div>

          <div className="p-6 space-y-6">
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase">Project</dt>
                <dd className="font-semibold mt-0.5">{projectName}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase">Stage</dt>
                <dd className="font-semibold mt-0.5">{stageName}</dd>
              </div>
              {deadline && (
                <div className="col-span-2">
                  <dt className="text-xs font-bold text-muted-foreground uppercase">Deadline</dt>
                  <dd className="font-semibold mt-0.5 text-destructive">
                    {new Date(deadline).toLocaleString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-bold text-muted-foreground uppercase">Status</dt>
                <dd className="mt-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-primary">
                    {request.status}
                  </span>
                </dd>
              </div>
            </dl>

            <InspectTokenActions
              token={token}
              requestId={request.id}
              projectId={request.stage?.project?.id}
              stageId={request.stageId}
              initialStatus={request.status}
              invitationToken={request.invitationToken}
              inspectorEmail={request.inspectorEmail}
            />

            <p className="text-center text-xs text-muted-foreground border-t border-border pt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>{" "}
              to complete checkpoints in the dashboard.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
