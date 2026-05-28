"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Send,
  LogIn,
  CheckCircle2,
} from "lucide-react";
import {
  markInspectionVisited,
  submitInspection,
} from "@/app/actions/inspections";

export default function InspectorFieldPanel({
  projectId,
  stageId,
  request,
  isAuthenticated,
}: {
  projectId: string;
  stageId: string;
  request: {
    id: string;
    status: string;
    token: string;
  };
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const workbenchHref = `/dashboard/projects/${projectId}/stages/${stageId}`;

  const markVisited = () => {
    setError(null);
    startTransition(async () => {
      const res = await markInspectionVisited(projectId, stageId, request.id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  };

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await submitInspection(projectId, stageId, request.id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 rounded-xl bg-secondary/50 border border-input/60 text-center">
        <p className="text-xs text-muted-foreground mb-3">
          Sign in as the assigned inspector to complete checkpoints and submit results.
        </p>
        <Button asChild size="sm" className="bg-primary text-white">
          <Link href={`/login?next=${encodeURIComponent(workbenchHref)}`}>
            <LogIn className="h-4 w-4 mr-1" />
            Sign in to continue
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl border border-border bg-white space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Inspector actions
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-primary">
          {request.status}
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      {(request.status === "ACCEPTED" || request.status === "SCHEDULED") && (
        <Button
          type="button"
          onClick={markVisited}
          disabled={isPending}
          className="w-full bg-primary text-white"
        >
          <MapPin className="h-4 w-4 mr-1" />
          {isPending ? "Updating..." : "Mark site visit started"}
        </Button>
      )}

      {request.status === "IN_PROGRESS" && (
        <>
          <p className="text-xs text-muted-foreground">
            Update each checkpoint below (PASS / FAIL / N/A), attach evidence, then submit.
          </p>
          <Button
            type="button"
            onClick={submit}
            disabled={isPending}
            className="w-full bg-primary text-white"
          >
            <Send className="h-4 w-4 mr-1" />
            {isPending ? "Submitting..." : "Submit inspection"}
          </Button>
        </>
      )}

      {request.status === "COMPLETED" && (
        <div className="flex items-center gap-2 text-xs text-primary font-medium">
          <CheckCircle2 className="h-4 w-4" />
          Inspection submitted — awaiting owner review
        </div>
      )}
    </div>
  );
}
