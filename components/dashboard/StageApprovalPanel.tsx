"use client";

import { useState, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approveStage, rejectStage } from "@/app/actions/approvals";
import { ShieldCheck, XCircle } from "lucide-react";

export default function StageApprovalPanel({
  projectId,
  stageId,
  stageStatus,
}: {
  projectId: string;
  stageId: string;
  stageStatus: string;
}) {
  const router = useRouter();
  const [approveError, setApproveError] = useState<string | null>(null);
  const [isApproving, startApprove] = useTransition();

  const boundReject = rejectStage.bind(null, projectId, stageId);
  const [rejectState, rejectAction, isRejecting] = useActionState(boundReject, undefined);

  if (stageStatus !== "SUBMITTED") {
    if (stageStatus === "APPROVED") {
      return (
        <div className="p-4 rounded-xl bg-secondary/60 border border-input/50 flex items-center gap-2 text-sm font-semibold text-primary">
          <ShieldCheck className="h-5 w-5" />
          Stage approved and locked
        </div>
      );
    }
    return null;
  }

  const handleApprove = () => {
    setApproveError(null);
    startApprove(async () => {
      const res = await approveStage(projectId, stageId);
      if (res?.error) setApproveError(res.error);
      else router.refresh();
    });
  };

  return (
    <div className="p-5 rounded-xl border-2 border-primary/30 bg-secondary/30 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground">Owner stage review</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Inspection is complete. Approve to lock the audit trail or reject with comments.
        </p>
      </div>
      {approveError && (
        <p className="text-xs text-destructive">{approveError}</p>
      )}
      {rejectState?.error && (
        <p className="text-xs text-destructive">{rejectState.error}</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={handleApprove}
          disabled={isApproving}
          className="bg-primary text-white"
        >
          <ShieldCheck className="h-4 w-4 mr-1" />
          {isApproving ? "Approving..." : "Approve stage"}
        </Button>
      </div>
      <form action={rejectAction} className="space-y-2 border-t border-border pt-4">
        <textarea
          name="comments"
          rows={2}
          placeholder="Rejection comments (optional)"
          className="w-full px-3 py-2 border border-input rounded-lg text-sm resize-y"
        />
        <Button
          type="submit"
          variant="outline"
          disabled={isRejecting}
          className="text-destructive border-destructive/30 hover:bg-red-50"
        >
          <XCircle className="h-4 w-4 mr-1" />
          {isRejecting ? "Rejecting..." : "Reject stage"}
        </Button>
      </form>
    </div>
  );
}
