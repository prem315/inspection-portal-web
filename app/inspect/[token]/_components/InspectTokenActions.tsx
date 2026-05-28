"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  acceptInspectionByToken,
  rejectInspectionByToken,
  markInspectionVisited,
} from "@/app/actions/inspections";
import { CheckCircle2, MapPin, LogIn, XCircle } from "lucide-react";

export default function InspectTokenActions({
  token,
  requestId,
  projectId,
  stageId,
  initialStatus,
  invitationToken,
  inspectorEmail,
}: {
  token: string;
  requestId: string;
  projectId?: string;
  stageId: string;
  initialStatus: string;
  invitationToken?: string;
  inspectorEmail?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [isPending, startTransition] = useTransition();

  const workbenchHref =
    projectId && stageId
      ? `/dashboard/projects/${projectId}/stages/${stageId}?requestId=${requestId}`
      : "/dashboard";

  const accept = () => {
    setError(null);
    startTransition(async () => {
      const res = await acceptInspectionByToken(token);
      if (res.error) setError(res.error);
      else {
        setStatus("ACCEPTED");
        router.refresh();
      }
    });
  };

  const reject = () => {
    setError(null);
    startTransition(async () => {
      const res = await rejectInspectionByToken(
        token,
        rejectReason || "Declined by inspector"
      );
      if (res.error) setError(res.error);
      else {
        setStatus("FAILED");
        setShowReject(false);
      }
    });
  };

  const markVisited = () => {
    if (!projectId) {
      setError("Sign in to mark visit and complete checkpoints.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await markInspectionVisited(projectId, stageId, requestId);
      if (res.error) setError(res.error);
      else {
        setStatus("IN_PROGRESS");
        router.push(workbenchHref);
      }
    });
  };

  const errorBanner = error ? (
    <div className="p-3 rounded-lg bg-red-50 border border-red-200/60 text-red-800 text-xs mb-4">
      {error}
      {error.includes("Sign in") && (
        <Button asChild size="sm" className="mt-3 w-full bg-primary text-white">
          <Link href={`/login?next=${encodeURIComponent(workbenchHref)}`}>
            <LogIn className="h-4 w-4 mr-1" />
            Sign in
          </Link>
        </Button>
      )}
    </div>
  ) : null;

  if (status === "SENT") {
    return (
      <div className="space-y-4">
        {errorBanner}
        {showReject ? (
          <div className="space-y-3">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for declining (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReject(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={reject}
                disabled={isPending}
                className="flex-1 text-destructive border-destructive/30"
              >
                Confirm decline
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowReject(true)}
              disabled={isPending}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Decline
            </Button>
            <Button
              type="button"
              onClick={accept}
              disabled={isPending}
              className="flex-1 bg-primary text-white"
            >
              {isPending ? "Accepting..." : "Accept inspection"}
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (status === "ACCEPTED" || status === "SCHEDULED") {
    if (invitationToken) {
      return (
        <div className="text-center space-y-5 animate-in fade-in duration-300">
          {errorBanner}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-secondary-foreground text-left leading-relaxed">
            <strong>Welcome!</strong> You have successfully accepted this inspection request. To begin logging checklist results and uploading site evidence, you need to create your inspector account first.
          </div>
          <Button asChild className="w-full h-11 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
            <Link href={`/register?token=${invitationToken}&email=${encodeURIComponent(inspectorEmail || "")}`}>
              Create Inspector Account
              <LogIn className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href={`/login?next=${encodeURIComponent(workbenchHref)}`} className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      );
    }

    return (
      <div className="text-center space-y-4">
        {errorBanner}
        <p className="text-sm text-muted-foreground">
          When you arrive on site, mark the visit as started. Sign in as the assigned
          inspector to update checkpoints and upload evidence.
        </p>
        <Button
          type="button"
          onClick={markVisited}
          disabled={isPending}
          className="bg-primary text-white"
        >
          <MapPin className="h-4 w-4 mr-1" />
          {isPending ? "Updating..." : "Mark site visit started"}
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/login?next=${encodeURIComponent(workbenchHref)}`}>
            <LogIn className="h-4 w-4 mr-1" />
            Sign in to field workbench
          </Link>
        </Button>
      </div>
    );
  }

  if (status === "IN_PROGRESS") {
    return (
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Complete all checkpoints and evidence in the workbench, then submit.
        </p>
        <Button asChild className="bg-primary text-white w-full">
          <Link href={workbenchHref}>Open workbench</Link>
        </Button>
      </div>
    );
  }

  if (status === "COMPLETED" || status === "SUBMITTED") {
    return (
      <div className="text-center p-6 rounded-xl bg-secondary/50 border border-input/50">
        <CheckCircle2 className="h-10 w-10 text-primary mx-auto mb-2" />
        <p className="text-sm font-bold">Inspection submitted</p>
        <p className="text-xs text-muted-foreground mt-1">
          The project team has been notified for review.
        </p>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <p className="text-center text-sm text-destructive font-medium">
        This request was declined.
      </p>
    );
  }

  return null;
}
