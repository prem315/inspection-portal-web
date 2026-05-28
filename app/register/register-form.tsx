"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  Loader2,
  ArrowRight,
  Building,
} from "lucide-react";
import { completeInvitation } from "@/app/actions/invitations";

interface RegisterFormProps {
  token: string;
  email: string;
  projectName: string;
  role: string;
  accountExists: boolean;
}

export default function RegisterForm({
  token,
  email,
  projectName,
  role,
  accountExists,
}: RegisterFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Bind completeInvitation action
  const [state, action, pending] = useActionState(completeInvitation, undefined);

  // Handle successful registration and redirection
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        const redirectUrl = state.projectId
          ? `/dashboard/projects/${state.projectId}`
          : "/dashboard/projects";
        router.push(redirectUrl);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  if (state?.success) {
    return (
      <div className="text-center space-y-5 py-8 animate-in fade-in duration-300">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-primary border border-primary/20 shadow-sm">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-heading text-foreground">Welcome to the Team!</h2>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Your account has been verified and you have joined <strong>{projectName}</strong>.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6 bg-muted/30 py-2 px-3 rounded-lg w-fit mx-auto">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Redirecting to your project dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome custom card */}
      <div className="p-5 rounded-2xl bg-secondary/40 border border-input/60 mb-6 text-sm text-foreground space-y-1 relative overflow-hidden">
        <div className="absolute -right-3 -top-3 h-14 w-14 bg-primary/5 rounded-full flex items-center justify-center pointer-events-none">
          <Building className="h-5 w-5 text-primary/30" />
        </div>
        <p className="font-bold text-foreground">
          Welcome! Complete your account setup to inspect <span className="text-primary font-extrabold">{projectName}</span>.
        </p>
        <p className="text-xs text-muted-foreground">
          Your project role: <strong className="text-secondary-foreground">{role === "EPC_ENGINEER" ? "EPC Engineer" : "Inspector"}</strong>.
        </p>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2.5 p-4 mb-5 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive text-xs font-medium leading-relaxed animate-in fade-in duration-200">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={action} className="space-y-5 font-sans">
        {/* Hidden parameters required for backend action */}
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="accountExists" value={accountExists ? "true" : "false"} />

        {/* Email Field (Prefilled & Disabled) */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground/30" />
            <input
              id="email"
              type="email"
              disabled
              value={email}
              className="w-full h-11 pl-11 pr-4 border border-border/40 bg-muted/30 text-muted-foreground/60 rounded-xl text-sm cursor-not-allowed font-sans"
            />
          </div>
        </div>

        {/* Full Name Field (Only if account does not exist) */}
        {!accountExists && (
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground/40" />
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                disabled={pending}
                className="w-full h-11 pl-11 pr-4 bg-muted/20 border border-border/60 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-muted-foreground/30 font-sans text-foreground transition-all"
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground/40" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              disabled={pending}
              className="w-full h-11 pl-11 pr-11 bg-muted/20 border border-border/60 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-muted-foreground/30 font-sans text-foreground transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-muted-foreground/40 hover:text-foreground cursor-pointer"
              disabled={pending}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          <span className="text-[10px] text-muted-foreground block">Password must be at least 6 characters.</span>
        </div>

        {/* Phone Field (Optional, only if account does not exist) */}
        {!accountExists && (
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground/40" />
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                disabled={pending}
                className="w-full h-11 pl-11 pr-4 bg-muted/20 border border-border/60 rounded-xl text-sm focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-muted-foreground/30 font-sans text-foreground transition-all"
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Completing setup...
            </>
          ) : (
            <>
              {accountExists ? "Link Account & Join Project" : "Create Account & Join Project"}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
