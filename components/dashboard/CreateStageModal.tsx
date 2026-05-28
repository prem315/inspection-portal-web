"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCustomStage, type StageActionState } from "@/app/actions/stages";
import { Plus, X, Layers, AlertCircle } from "lucide-react";

interface CreateStageModalProps {
  projectId: string;
  defaultDisplayOrder: number;
}

export default function CreateStageModal({
  projectId,
  defaultDisplayOrder,
}: CreateStageModalProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const boundAction = createCustomStage.bind(null, projectId);
  const [state, action, pending] = useActionState<StageActionState, FormData>(
    boundAction,
    undefined
  );

  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-primary-foreground hover:bg-primary/95 gap-1.5 rounded-xl text-xs font-semibold px-4 py-2 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Add custom stage
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Create custom stage</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Banner */}
            {state?.error && (
              <div className="mx-5 mt-4 flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Form */}
            <form ref={formRef} action={action} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-foreground">
                  Stage Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g., Foundation Rebar Check"
                  className="rounded-xl border-border bg-background h-10 text-sm focus-visible:ring-primary focus-visible:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold text-foreground">
                  Description (Optional)
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Describe the checkpoints and purpose of this stage..."
                  className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="displayOrder" className="text-xs font-bold text-foreground">
                  Display Order
                </Label>
                <Input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  required
                  min={1}
                  defaultValue={defaultDisplayOrder}
                  className="rounded-xl border-border bg-background h-10 text-sm focus-visible:ring-primary focus-visible:border-primary"
                />
                <p className="text-[10px] text-muted-foreground">
                  Determines the sorting order of the stage within this project.
                </p>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="rounded-xl text-xs font-semibold py-4.5 border-border hover:bg-muted cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={pending}
                  className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl text-xs font-semibold py-4.5 cursor-pointer"
                >
                  {pending ? "Creating..." : "Create stage"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
