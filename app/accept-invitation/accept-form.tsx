"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  completeInvitation,
  type CompleteInvitationState,
} from "@/app/actions/invitations";

interface AcceptFormProps {
  token: string;
  projectName: string;
  projectId: string;
  role: "EPC_ENGINEER" | "INSPECTOR";
  email: string;
  accountExists: boolean;
}

export default function AcceptForm({
  token,
  projectName,
  projectId,
  role,
  email,
  accountExists,
}: AcceptFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState<
    CompleteInvitationState,
    FormData
  >(completeInvitation, undefined);

  const roleLabel = role === "EPC_ENGINEER" ? "EPC Engineer" : "Inspector";
  const successMessage =
    state?.message ||
    (accountExists
      ? "Invitation accepted successfully."
      : "Account created and invitation accepted successfully.");

  useEffect(() => {
    if (!state?.success) return;

    const destination =
      state.role === "INSPECTOR"
        ? `/dashboard/projects/${state.projectId || projectId}`
        : `/dashboard/projects/${state.projectId || projectId}`;

    const timeout = window.setTimeout(() => {
      router.push(destination);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [projectId, router, state?.projectId, state?.role, state?.success]);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50 p-6 text-center text-emerald-900">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold">{successMessage}</h2>
        <p className="mt-2 text-xs text-emerald-800/80">
          Redirecting to the project dashboard...
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="accountExists" value={String(accountExists)} />

      <div className="rounded-2xl border border-border bg-slate-50/70 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Project invitation
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
          {projectName}
        </h1>

        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Invited email
            </dt>
            <dd className="mt-1 rounded-lg border border-input bg-white px-3 py-2 text-foreground">
              {email}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Role
            </dt>
            <dd className="mt-1">
              <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                {roleLabel}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h2 className="text-base font-bold text-foreground">
          {accountExists ? "Accept invitation" : "Create account"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {accountExists
            ? "Enter your password to accept this project invitation."
            : "Create your account to join this project."}
        </p>
      </div>

      {!accountExists && (
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-xs font-bold uppercase tracking-wide text-foreground"
          >
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/60" />
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="EPC Engineer Name"
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-input bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
            />
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="text-xs font-bold uppercase tracking-wide text-foreground"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/60" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            autoComplete={accountExists ? "current-password" : "new-password"}
            placeholder="Minimum 6 characters"
            disabled={isPending}
            className="h-10 w-full rounded-lg border border-input bg-white pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-2.5 text-muted-foreground/60 hover:text-foreground"
            disabled={isPending}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4.5 w-4.5" />
            ) : (
              <Eye className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>

      {!accountExists && (
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="text-xs font-bold uppercase tracking-wide text-foreground"
          >
            Phone number <span className="text-muted-foreground">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground/60" />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1234567890"
              disabled={isPending}
              className="h-10 w-full rounded-lg border border-input bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
            />
          </div>
        </div>
      )}

      {state?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200/60 bg-red-50 p-3 text-xs text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/95"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            Completing invitation...
          </>
        ) : accountExists ? (
          "Accept Invitation"
        ) : (
          "Create Account & Accept Invitation"
        )}
      </Button>
    </form>
  );
}
