import Link from "next/link";
import { AlertCircle, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { verifyInvitationToken } from "@/app/actions/invitations";
import AcceptForm from "./accept-form";
import { Button } from "@/components/ui/button";

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let verifyResult = null;
  if (token) {
    verifyResult = await verifyInvitationToken(token);
  }

  const isValidToken = verifyResult?.valid === true;
  const errorMessage = token
    ? verifyResult?.error || "Invalid, expired, or already accepted invitation."
    : "Invitation token is required.";

  return (
    <main className="min-h-screen bg-background px-4 py-8 font-sans sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col justify-center">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-white/80 px-3.5 py-2 text-xs font-bold text-muted-foreground shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Inspect<span className="text-primary">Flow</span>
            </span>
          </div>

          {!isValidToken ? (
            <InvalidInvitation message={errorMessage} />
          ) : (
            <AcceptForm
              token={token!}
              projectName={verifyResult!.projectName}
              projectId={verifyResult!.projectId}
              role={verifyResult!.role}
              email={verifyResult!.email}
              accountExists={verifyResult!.accountExists === true}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function InvalidInvitation({ message }: { message: string }) {
  const isAlreadyAccepted = message.toLowerCase().includes("status: accepted");

  if (isAlreadyAccepted) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Already Accepted
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              You have already joined this project team!
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-green-200/60 bg-green-50/50 p-4 text-sm text-green-800 leading-relaxed">
          This invitation has already been accepted and your project assignment is active. You can access all project files and stages directly from your dashboard.
        </div>

        <Button asChild className="w-full h-11 bg-primary text-white hover:bg-primary/95 text-sm font-semibold rounded-lg shadow-sm">
          <Link href="/dashboard/projects">Go to Projects Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Invalid invitation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This invitation cannot be used.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-red-200/60 bg-red-50 p-4 text-sm text-red-800">
        {message}
      </div>

      <p className="text-xs text-muted-foreground">
        The invitation may be expired, already accepted, or no longer valid. Ask
        the project owner to send a new invitation if you still need access.
      </p>
    </div>
  );
}
