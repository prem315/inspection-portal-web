import { Suspense } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Building,
  CheckCircle2,
  MapPin,
  Sun,
} from "lucide-react";
import { verifyInvitationToken } from "@/app/actions/invitations";
import RegisterForm from "./register-form";
import { Button } from "@/components/ui/button";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let verifyResult = null;
  if (token) {
    verifyResult = await verifyInvitationToken(token);
  }

  const isValidToken = verifyResult?.valid === true;
  const errorMessage = verifyResult?.error || "Invalid or expired invitation token.";

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background font-sans">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white px-3.5 py-2 rounded-xl border border-border shadow-sm backdrop-blur-md transition-all cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>

      {/* Left side (Form/Message Panel) */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-12 md:p-16 lg:p-20 bg-background relative z-10">
        <div className="my-auto mx-auto w-full max-w-md py-12">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/15">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-heading">
              Inspect<span className="text-primary font-extrabold">Flow</span>
            </span>
          </div>

          {!isValidToken ? (
            /* Warning/Error Cases */
            errorMessage.toLowerCase().includes("status: accepted") ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2 font-heading">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                    Already Accepted
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You have already accepted this invitation and joined the project team!
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-xs text-secondary-foreground leading-relaxed">
                  This invitation has already been accepted and your project assignment is active. You can log in and access all project features directly.
                </div>

                <div className="pt-2">
                  <Button asChild className="w-full h-11 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl shadow-sm">
                    <Link href="/login">Go to Login</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2 font-heading">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    Invitation Error
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This invitation link is invalid or has expired. Please request a new inspection invitation.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-xs text-destructive font-medium leading-relaxed">
                  Reason: {errorMessage}
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If you believe this is an error, please ask the project administrator or EPC Engineer to send a new invitation to your email.
                  </p>
                </div>
              </div>
            )
          ) : (
            /* Registration Form Page */
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-heading">
                  Create your account
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Fill in your details below to activate your account and join the project.
                </p>
              </div>

              <Suspense fallback={<p className="text-sm text-muted-foreground">Loading form...</p>}>
                <RegisterForm
                  token={token!}
                  email={verifyResult!.email}
                  projectName={verifyResult!.projectName}
                  role={verifyResult!.role}
                  accountExists={verifyResult!.accountExists || false}
                />
              </Suspense>
            </div>
          )}

          {/* Footer inside form panel */}
          <div className="mt-8 text-center text-xs text-muted-foreground/80 border-t border-border/30 pt-6">
            Securing industrial field releases and construction milestones.
          </div>

        </div>
      </div>

      {/* Right side (Visual Showcase) */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-between p-12 xl:p-16 bg-gradient-to-br from-primary via-primary/95 to-secondary-foreground text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--secondary),transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary-foreground),transparent_40%)] opacity-10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Showcase Header */}
        <div className="relative flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl border border-white/15 backdrop-blur-md">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">PROJECT ONBOARDING</div>
            <div className="text-xs font-extrabold tracking-tight">InspectFlow Compliance Portal</div>
          </div>
        </div>

        {/* Live Card Mockup in Center */}
        <div className="relative my-auto max-w-lg mx-auto w-full">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            {/* Header dots */}
            <div className="flex items-center gap-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <span className="text-[9px] font-bold text-white/50 ml-2 tracking-widest uppercase">Active Project Stage</span>
            </div>

            {/* Stage title */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Industry: Renewable Energy</div>
                <h3 className="text-xl font-extrabold text-white mt-1 font-heading flex items-center gap-2">
                  <Sun className="h-5 w-5 text-amber-300 fill-amber-300/20" />
                  {verifyResult?.projectName || "Mojave Grid Array E"}
                </h3>
                <div className="flex items-center gap-1 text-xs text-white/80 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-white/60" />
                  Field Inspection & Verification Stage
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold text-white border border-white/10">
                In Progress
              </span>
            </div>

            {/* Stages Pipeline */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="h-7 w-7 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">Draft Setup & Layout</div>
                  <div className="text-[10px] text-white/60 truncate">Approved by Owner • Active</div>
                </div>
                <span className="text-[10px] font-bold text-white/60 uppercase shrink-0">100%</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-4 bg-white/10 border border-white/15 rounded-xl p-3 relative overflow-hidden">
                <div className="absolute left-0 bottom-0 top-0 bg-white/5 w-[65%]" />
                <div className="h-7 w-7 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs shrink-0 relative animate-pulse">
                  2
                </div>
                <div className="flex-1 min-w-0 relative">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                    EPC Design Verification
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-ping" />
                  </div>
                  <div className="text-[10px] text-white/80 truncate">Pending Checklist: Cable Layouts</div>
                </div>
                <span className="text-[10px] font-bold text-white relative shrink-0">65%</span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3 opacity-60">
                <div className="h-7 w-7 rounded-full bg-white/10 text-white/60 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">Field Inspection</div>
                  <div className="text-[10px] text-white/60 truncate">Requires Inspector Assignment</div>
                </div>
                <span className="text-[10px] font-bold text-white/60 uppercase shrink-0">0%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Showcase Footer */}
        <div className="relative bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl max-w-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-300 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-white">Built for field compliance</div>
              <div className="text-[10px] text-white/70 mt-0.5 leading-relaxed">
                Once registered, you can log in, view the project checklist, and upload evidence for inspectable stages.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
