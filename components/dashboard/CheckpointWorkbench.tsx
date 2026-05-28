"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Paperclip, AlertCircle, Loader2 } from "lucide-react";
import {
  updateCheckpointResult,
  deleteCheckpoint,
} from "@/app/actions/checkpoints";
import { getPresignedUrl, createEvidence } from "@/app/actions/evidence";
import type { Checkpoint, CheckpointResult } from "@/lib/types";

const RESULT_STYLES: Record<
  CheckpointResult,
  { bg: string; text: string }
> = {
  PENDING: { bg: "bg-muted", text: "text-muted-foreground" },
  PASS: { bg: "bg-secondary", text: "text-primary" },
  FAIL: { bg: "bg-red-50", text: "text-destructive" },
  NA: { bg: "bg-muted", text: "text-foreground" },
};

export default function CheckpointWorkbench({
  projectId,
  stageId,
  checkpoints,
  canEditResults,
  canDelete,
  inspectionRequestId,
}: {
  projectId: string;
  stageId: string;
  checkpoints: Checkpoint[];
  canEditResults: boolean;
  canDelete: boolean;
  inspectionRequestId?: string;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleResultChange = (checkpointId: string, result: CheckpointResult) => {
    setPendingId(checkpointId);
    setError(null);
    startTransition(async () => {
      const res = await updateCheckpointResult(
        projectId,
        stageId,
        checkpointId,
        result
      );
      if (res.error) setError(res.error);
      setPendingId(null);
      router.refresh();
    });
  };

  const handleDelete = (checkpointId: string) => {
    if (!confirm("Delete this checkpoint?")) return;
    setPendingId(checkpointId);
    startTransition(async () => {
      await deleteCheckpoint(projectId, stageId, checkpointId);
      setPendingId(null);
      router.refresh();
    });
  };

  const handleUpload = async (
    checkpointId: string,
    file: File,
    notes: string
  ) => {
    setUploadingId(checkpointId);
    setError(null);
    try {
      const presign = await getPresignedUrl(file.name, file.type);
      const uploadRes = await fetch(presign.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) {
        throw new Error("Failed to upload file to storage");
      }
      const type = file.type.startsWith("image/") ? "PHOTO" : "DOCUMENT";
      const res = await createEvidence(projectId, stageId, checkpointId, {
        type,
        fileUrl: presign.fileUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type,
        notes: notes || undefined,
        inspectionRequestId,
      });
      if (res.error) throw new Error(res.error);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  if (checkpoints.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        No checkpoints yet. EPC engineers add checklist items before requesting inspection.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200/60 text-red-800 text-xs"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {checkpoints.map((cp, index) => {
        const style = RESULT_STYLES[cp.result] || RESULT_STYLES.PENDING;
        return (
          <article
            key={cp.id}
            className="p-4 rounded-xl border border-border bg-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex gap-3.5 min-w-0">
                {canEditResults ? (
                  <div className="flex items-start shrink-0 pt-0.5">
                    <input
                      type="checkbox"
                      checked={cp.result === "PASS"}
                      disabled={pendingId === cp.id}
                      onChange={(e) =>
                        handleResultChange(
                          cp.id,
                          e.target.checked ? "PASS" : "PENDING"
                        )
                      }
                      className="h-5 w-5 rounded-md border border-border/80 text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                  </div>
                ) : (
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.bg} ${style.text}`}
                  >
                    {index + 1}
                  </span>
                )}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-foreground">{cp.title}</h4>
                  {cp.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cp.description}
                    </p>
                  )}
                  {cp.notes && (
                    <p className="text-xs text-primary mt-1">Notes: {cp.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {canEditResults ? (
                  <select
                    value={cp.result}
                    disabled={pendingId === cp.id}
                    onChange={(e) =>
                      handleResultChange(
                        cp.id,
                        e.target.value as CheckpointResult
                      )
                    }
                    className={`h-9 px-2 rounded-lg border text-xs font-bold ${style.bg} ${style.text} border-border`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                    <option value="NA">N/A</option>
                  </select>
                ) : (
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${style.bg} ${style.text}`}
                  >
                    {cp.result}
                  </span>
                )}
                {canEditResults && (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      disabled={uploadingId === cp.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUpload(cp.id, file, "");
                        }
                        e.target.value = "";
                      }}
                    />
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-primary hover:bg-secondary transition-colors"
                      title="Upload evidence"
                    >
                      {uploadingId === cp.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Paperclip className="h-4 w-4" />
                      )}
                    </span>
                  </label>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(cp.id)}
                    disabled={pendingId === cp.id}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
