"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createInspectionRequest } from "@/app/actions/inspections";
import { Link2, Copy, X } from "lucide-react";

export default function CreateInspectionRequestModal({
  projectId,
  stageId,
}: {
  projectId: string;
  stageId: string;
}) {
  const [open, setOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const bound = createInspectionRequest.bind(null, projectId, stageId);
  const [state, action, pending] = useActionState(bound, undefined);

  useEffect(() => {
    if (state?.request?.token) {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      setShareUrl(`${origin}/inspect/${state.request.token}`);
    }
  }, [state?.request?.token]);

  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const close = () => {
    setOpen(false);
    setShareUrl(null);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-xs font-bold rounded-xl cursor-pointer"
      >
        <Link2 className="h-3.5 w-3.5 mr-1" />
        Request inspection
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-bold font-heading">Dispatch inspection</h3>
              <button type="button" onClick={close} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {shareUrl ? (
              <div className="p-5 space-y-4 text-center font-sans">
                <p className="text-sm font-semibold text-foreground">
                  Inspection request created
                </p>
                <p className="text-xs text-muted-foreground">
                  Share this link with the assigned inspector:
                </p>
                <code className="block text-[10px] p-3 bg-muted rounded-lg break-all text-left">
                  {shareUrl}
                </code>
                <Button
                  type="button"
                  onClick={copyLink}
                  className="w-full bg-primary text-white hover:bg-primary/95 rounded-xl text-xs font-bold h-11"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copied ? "Copied" : "Copy link"}
                </Button>
                <Button type="button" variant="outline" onClick={close} className="w-full rounded-xl text-xs font-bold h-11">
                  Close
                </Button>
              </div>
            ) : (
              <form action={action} className="p-5 space-y-4 font-sans">
                <div className="space-y-1.5">
                  <label htmlFor="inspectorEmail" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Inspector Email
                  </label>
                  <input
                    id="inspectorEmail"
                    type="email"
                    name="inspectorEmail"
                    required
                    placeholder="inspector@example.com"
                    className="w-full h-11 px-3.5 bg-muted/20 border border-border/60 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-muted-foreground/40 font-sans text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="deadlineStart" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Start Date (optional)
                  </label>
                  <input
                    id="deadlineStart"
                    type="datetime-local"
                    name="deadlineStart"
                    className="w-full h-11 px-3.5 bg-muted/20 border border-border/60 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none font-sans text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="deadlineEnd" className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    End Date / Deadline (optional)
                  </label>
                  <input
                    id="deadlineEnd"
                    type="datetime-local"
                    name="deadlineEnd"
                    className="w-full h-11 px-3.5 bg-muted/20 border border-border/60 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none font-sans text-foreground"
                  />
                </div>
                {state?.error && (
                  <p className="text-xs text-destructive font-medium">{state.error}</p>
                )}
                <div className="flex gap-2 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={close} className="rounded-xl text-xs font-bold h-11">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={pending}
                    className="bg-primary text-white hover:bg-primary/95 rounded-xl text-xs font-bold h-11 px-5"
                  >
                    {pending ? "Sending..." : "Create request"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
