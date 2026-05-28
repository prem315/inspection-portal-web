"use client";

import * as React from "react";
import { useActionState } from "react";
import { updateUserProfile, type UpdateProfileState } from "@/app/actions/profile";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Phone, CheckCircle2, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  initialProfile: {
    name: string;
    email: string;
    role: string;
    phone?: string;
  };
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateUserProfile,
    undefined
  );

  const formatRole = (role: string) => {
    switch (role) {
      case "OWNER":
        return "Owner (Full Admin Access)";
      case "EPC_ENGINEER":
        return "EPC Engineer";
      case "INSPECTOR":
        return "Inspector";
      case "SUPER_ADMIN":
        return "Super Admin";
      default:
        return role;
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Profile Settings
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          View your account information and update your personal contact details.
        </p>
      </div>

      <form action={formAction}>
        <Card className="border-border bg-white shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border bg-muted/20 px-6 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-primary" />
              Personal Details
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Manage your details and how you are identified in project reports.
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {/* Success Banner */}
            {state?.success && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary text-secondary-foreground border border-primary/20 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-xs font-semibold">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {/* Error Banner */}
            {state?.error && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 animate-fade-in">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-xs font-semibold">
                  {state.error}
                </p>
              </div>
            )}

            <div className="grid gap-5">
              {/* Name field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold text-foreground">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={initialProfile.name}
                    placeholder="Enter your full name"
                    required
                    className="pl-9 h-10 border-border bg-background focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-foreground">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={initialProfile.phone || ""}
                    placeholder="Enter your phone number (optional)"
                    className="pl-9 h-10 border-border bg-background focus-visible:ring-primary focus-visible:border-primary rounded-xl"
                  />
                </div>
              </div>

              {/* Email field (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-foreground opacity-70">
                  Email Address (Read-only)
                </Label>
                <div className="relative opacity-75">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    id="email"
                    type="email"
                    value={initialProfile.email}
                    disabled
                    className="pl-9 h-10 border-border bg-muted/30 text-muted-foreground select-none cursor-not-allowed rounded-xl"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/80 pl-1">
                  Contact support if you need to change your registered email.
                </p>
              </div>

              {/* Role field (Read-only) */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground opacity-70">
                  Assigned Workspace Role (Read-only)
                </Label>
                <div className="relative opacity-75">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <Input
                    type="text"
                    value={formatRole(initialProfile.role)}
                    disabled
                    className="pl-9 h-10 border-border bg-muted/30 text-muted-foreground select-none cursor-not-allowed rounded-xl"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border bg-muted/10 px-6 py-4 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/95 px-5 py-4 h-auto rounded-xl font-semibold shadow-sm transition-colors text-xs cursor-pointer"
            >
              {isPending ? "Saving changes..." : "Save changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
