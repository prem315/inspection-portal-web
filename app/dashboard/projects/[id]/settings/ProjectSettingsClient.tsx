"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { seedProjectStages } from "@/app/actions/stages";
import { AlertTriangle, Check, Loader2 } from "lucide-react";

export default function ProjectSettingsClient({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    if (!confirm("Are you absolutely sure you want to reset all stages? This will clear all existing stages and checkpoints, and clone them freshly from the template blueprint.")) {
      return;
    }

    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await seedProjectStages(projectId);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("Project stages reset successfully!");
        setTimeout(() => {
          router.push(`/dashboard/projects/${projectId}/stages`);
        }, 1500);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-slate-50/30">
        <h2 className="text-sm font-bold text-foreground">Project Maintenance</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Manage stages and defaults for this project.</p>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="space-y-1 max-w-xl">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Reset Project Stages & Checkpoints
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Resetting will clear all current custom stages, default stages, and checkpoints. The project's stages and checkpoints will be re-cloned cleanly from the original template blueprint. Any recorded inspection data, evidence, or approvals will be cleared.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 text-white font-bold px-5 rounded-xl text-xs cursor-pointer shrink-0"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Resetting...
              </>
            ) : (
              "Reset Stages"
            )}
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            <Check className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}
      </div>
    </div>
  );
}
