"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { login, type LoginState } from "@/app/actions/auth";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const emailParam = searchParams.get("email") || "";
  const registered = searchParams.get("registered") === "true";

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {registered && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 mb-6 rounded-xl bg-secondary/80 border border-primary/10 text-secondary-foreground text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>Account created successfully! Please sign in with your password.</span>
        </div>
      )}

      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 mb-6 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {next && <input type="hidden" name="next" value={next} />}
        
        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
            Email address
          </label>
          <div className="relative flex items-center text-muted-foreground/40 focus-within:text-primary transition-colors">
            <Mail className="absolute left-3.5 h-4.5 w-4.5 transition-colors" />
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="name@company.com"
              disabled={isPending}
              defaultValue={emailParam}
              className="w-full h-11 pl-11 pr-4 bg-muted/20 border border-border/60 rounded-xl text-sm transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-muted-foreground/40 disabled:opacity-60 font-sans text-foreground"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
              Password
            </label>
            <a href="#" className="text-xs font-bold text-primary hover:underline transition-all">
              Forgot?
            </a>
          </div>
          <div className="relative flex items-center text-muted-foreground/40 focus-within:text-primary transition-colors">
            <Lock className="absolute left-3.5 h-4.5 w-4.5 transition-colors" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isPending}
              className="w-full h-11 pl-11 pr-10 bg-muted/20 border border-border/60 rounded-xl text-sm transition-all focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none placeholder:text-muted-foreground/40 disabled:opacity-60 font-sans text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
              disabled={isPending}
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-11 bg-primary text-white hover:bg-primary/95 text-xs font-bold tracking-wider uppercase rounded-xl shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isPending ? "Authenticating..." : "Sign in to InspectFlow"}
          {!isPending && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    </>
  );
}
