"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createCheckpoint } from "@/app/actions/checkpoints";
import { Plus } from "lucide-react";

export default function CreateCheckpointForm({
  projectId,
  stageId,
}: {
  projectId: string;
  stageId: string;
}) {
  const router = useRouter();
  const bound = createCheckpoint.bind(null, projectId, stageId);
  const [state, action, pending] = useActionState(bound, undefined);

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state?.success, router]);

  return (
    <form action={action} className="p-4 rounded-xl border border-dashed border-border bg-muted/20 space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Add checkpoint
      </p>
      <input
        name="title"
        required
        placeholder="e.g. Verify inverter mounting alignment"
        className="w-full h-10 px-3 border border-input rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      />
      <input
        name="description"
        placeholder="Check that all inverters are level and aligned to specification"
        className="w-full h-10 px-3 border border-input rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      />
      <input
        name="standardReference"
        placeholder="IEC reference (optional)"
        className="w-full h-10 px-3 border border-input rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      />
      {state?.error && (
        <p className="text-xs text-destructive font-medium">{state.error}</p>
      )}
      <Button
        type="submit"
        disabled={pending}
        size="sm"
        className="bg-primary text-white"
      >
        <Plus className="h-4 w-4 mr-1" />
        {pending ? "Adding..." : "Add checkpoint"}
      </Button>
    </form>
  );
}
