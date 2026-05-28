import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  Sun,
  Wind,
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  PhoneCall,
  MessageSquare,
  FileText,
  AlertTriangle,
  Building,
  ArrowDown,
  ChevronRight,
  Zap,
  TrendingUp,
  MapPin,
  Quote,
  ShieldAlert,
  Server,
  UserCheck,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPageV2() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-foreground font-sans selection:bg-primary/10 selection:text-primary">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-700 text-white shadow-lg shadow-primary/15">
              <ShieldCheck className="h-5.5 w-5.5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-heading text-slate-900">
              Inspect<span className="text-primary font-extrabold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Flow</span>
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-500 hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Button
              asChild
              className="bg-primary text-white hover:bg-primary/95 text-xs font-bold h-10 px-5 rounded-xl shadow-md shadow-primary/15 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Link href="/login">Launch Workbench</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Modern ambient backdrops */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-3xl -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b6d11_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.15] -z-10" />

        <div className="container mx-auto max-w-7xl px-6 text-center space-y-8">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            India Solar & Wind EPC Compliance
          </span>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 font-heading max-w-4xl mx-auto leading-[1.1] text-balance">
            One platform. Everyone on the same page. <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">Everything recorded.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-sans">
            Think of it like a booking system for inspections &mdash; built specifically for EPC projects in renewable energy, with all the accountability, tracking, and documentation built in.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center pt-4">
            <Button
              asChild
              className="bg-primary text-white hover:bg-primary/95 text-sm font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/10 flex items-center gap-2 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Link href="/login">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-8 rounded-xl text-sm font-bold border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
            >
              <a href="#problem">
                Explore the Gap
                <ArrowDown className="h-4 w-4 text-slate-400" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary font-heading">
                <ShieldAlert className="h-4 w-4" />
                THE PROBLEM
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading leading-tight">
                India is building hundreds of wind and solar projects. <br />
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">But nobody has solved how inspections actually get done.</span>
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-slate-500 leading-relaxed font-sans">
                <p>
                  When a construction stage is ready to be inspected, an EPC team needs a third-party inspector to come to the site, verify the work, and sign off on it. That sign-off is required by lenders, insurers, and the project owner before the next stage can begin. Without it, the whole project stops.
                </p>
                <p>
                  Today, that entire process is managed over WhatsApp, phone calls, and email. There is no system. There is no tracking. There is no accountability.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 font-heading">
                <Clock className="h-4 w-4" />
                A TYPICAL DAY ON A SOLAR EPC PROJECT
              </span>

              {/* Timeline Cards */}
              <div className="space-y-4 relative">
                <div className="absolute left-[29px] top-6 bottom-6 w-[2px] bg-slate-100 border-dashed border-l" />

                <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all shadow-sm group">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-105 transition-all z-10">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">Monday morning — stage is ready</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      The EPC engineer finishes the foundation work. It is ready for inspection. He sends a WhatsApp message to the inspector. No reply.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all shadow-sm group">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-105 transition-all z-10">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">Tuesday — still waiting</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      He calls. The inspector says he will come Wednesday. Nobody records this conversation. The project owner has no idea what is happening.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all shadow-sm group">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-105 transition-all z-10">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">Wednesday — inspector does not show up</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      No call. No message. The EPC engineer tries again. Meanwhile, the next stage of construction cannot start. Workers are waiting. Costs are running.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-all shadow-sm group">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-red-600 shadow-sm group-hover:scale-105 transition-all z-10">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-heading">Friday — the owner asks for a status update</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Nobody can give a clear answer. The project is delayed. The lender is asking questions. And the paper trail is a mess of WhatsApp screenshots.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* The Pain Quotes Section */}
      <section className="py-24 bg-slate-50/30 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center space-y-2 mb-16">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary font-heading">
              <Quote className="h-4 w-4" />
              THE PAIN
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
              In the words of EPC Teams
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed italic">
                &ldquo;We had an inspector not show up for 11 days. The whole project was waiting. We had no way to escalate because there was no paper trail &mdash; just a WhatsApp thread where he stopped replying.&rdquo;
              </p>
              <div className="border-t border-slate-50 pt-4 mt-6">
                <div className="text-xs font-bold text-slate-800 font-heading">Site Manager</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Solar EPC project, Rajasthan</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed italic">
                &ldquo;When the lender asked for the inspection records, we spent two weeks collecting photos from everyone&apos;s phones and putting them in a folder. It should have been one click.&rdquo;
              </p>
              <div className="border-t border-slate-50 pt-4 mt-6">
                <div className="text-xs font-bold text-slate-800 font-heading">Project Director</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Wind park, Gujarat</div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
              <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed italic">
                &ldquo;The inspector said he came and found an issue. We said the stage was clean. Nobody had documentation. That dispute cost us six weeks.&rdquo;
              </p>
              <div className="border-t border-slate-50 pt-4 mt-6">
                <div className="text-xs font-bold text-slate-800 font-heading">EPC Contractor</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Transmission line project, Maharashtra</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Keeps Happening */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-6 text-center space-y-16">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary font-heading">
              <AlertTriangle className="h-4 w-4" />
              WHY THIS KEEPS HAPPENING
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
              The roots of project compliance delays
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white transition-all duration-200 space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-heading">No formal system</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Everything runs on WhatsApp and phone calls. Reminders are manual and updates are hidden in individual group chats.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white transition-all duration-200 space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-heading">No accountability</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspectors can ignore or miss inspection request dates with zero record or visible consequence on the project pipeline.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white transition-all duration-200 space-y-5">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-heading">No records & trail</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                No formal audit trail, no evidence validation, and no transparent timeline of who verified what and when.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Before and After Comparison */}
      <section className="py-24 bg-slate-50/20 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center space-y-2 mb-16">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary font-heading">
              <Layers className="h-4 w-4" />
              BEFORE AND AFTER
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
              How the tool changes the workflow
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Without this tool */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-red-50/40 border border-red-100 text-red-950 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-red-700 flex items-center gap-2 mb-6 font-heading">
                  <XCircle className="h-5 w-5 text-red-500" />
                  WITHOUT THIS TOOL
                </h4>
                <ul className="space-y-4 text-xs sm:text-sm text-red-900/80">
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5 font-bold">✕</span>
                    <span>Inspection request sent over WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5 font-bold">✕</span>
                    <span>Inspector can ignore or miss &mdash; no consequence</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5 font-bold">✕</span>
                    <span>No deadline, no tracking, no alerts</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5 font-bold">✕</span>
                    <span>Photos in random phone gallery folders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5 font-bold">✕</span>
                    <span>Owner has no visibility until someone calls</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-red-500 mt-0.5 font-bold">✕</span>
                    <span>Audit report compiled manually in Word</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-red-200/50 flex items-center gap-2 text-red-800 font-bold text-xs sm:text-sm">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Project delayed. Nobody knows why.</span>
              </div>
            </div>

            {/* Transition Arrow */}
            <div className="lg:col-span-2 flex items-center justify-center text-slate-300 py-4 lg:py-0">
              <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <ArrowRight className="h-5 w-5 text-slate-400 rotate-90 lg:rotate-0" />
              </div>
            </div>

            {/* With this tool */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-secondary/20 border border-primary/10 text-secondary-foreground flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2 mb-6 font-heading">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  WITH THIS TOOL
                </h4>
                <ul className="space-y-4 text-xs sm:text-sm text-secondary-foreground/80">
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>Inspection request sent as a tracked link</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>Inspector must accept or reject &mdash; recorded</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>Deadline set, missed = automatic alert + retry</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>Photos attached to exact checklist item</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>Owner sees live status of every stage</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span>PDF report generated in one click</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-6 border-t border-primary/10 flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>Project moves. Everyone knows why.</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The Solution Steps Section */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center space-y-2 mb-16">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary font-heading">
              <Zap className="h-4 w-4" />
              THE SOLUTION
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
              How InspectFlow works
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs font-heading">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">Stage is ready &mdash; engineer generates a link</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                  With one tap, the EPC engineer creates an inspection request inside the app. The system generates a unique link and sends it to the inspector automatically.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs font-heading">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">Inspector accepts or rejects &mdash; with a reason</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                  The inspector opens the link &mdash; no login needed &mdash; and either accepts the visit with a date, or rejects with a reason. Everything is recorded. No more silent ignored messages.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs font-heading">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">System tracks the deadline automatically</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                  The agreed date is locked in. If the inspector does not show up, the system immediately flags it, notifies the EPC engineer and project owner, and automatically gives a new deadline window.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs font-heading">
                4
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">Inspector records everything on site</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                  From their phone, the inspector fills a checklist, takes photos, adds measurements, and uploads documents &mdash; all attached to the exact item they belong to, not buried in a shared folder.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs font-heading">
                5
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">Owner reviews and approves with one click</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                  Once the inspection is complete, the project owner gets a notification, reviews the full report &mdash; checklists, photos, findings &mdash; and approves or sends it back with comments.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-sm transition-all duration-200">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs font-heading">
                6
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading">Full audit trail generated automatically</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                  Every action, timestamp, photo, and approval is stored permanently. A PDF report can be generated in one click for lenders, insurers, or government bodies. No chasing documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses It */}
      <section className="py-24 bg-slate-50/20 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center space-y-2 mb-16">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary font-heading">
              <Users className="h-4 w-4" />
              USER ROLES
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
              Who uses InspectFlow?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-emerald-50 text-primary font-bold flex items-center justify-center text-xs border border-primary/10 shadow-sm">
                OW
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-emerald-600" />
                  Project Owner
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Sees the status of every stage across all projects. Approves inspections. Never chases updates again.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-xs border border-amber-200 shadow-sm">
                EP
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-amber-600" />
                  EPC Engineer
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Generates inspection links, records findings on site from a phone. No paperwork.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-200 shadow-sm">
                IN
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  Independent Inspector
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Gets a link, accepts the visit, fills the checklist on site. No new system to learn.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-xs border border-purple-200 shadow-sm">
                IT
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-1.5">
                  <Server className="h-4 w-4 text-purple-600" />
                  IT / Admin Team
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Manages all users and projects from one admin panel. Full visibility across the organisation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters for India */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="text-center space-y-2 mb-16">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary font-heading">
              <TrendingUp className="h-4 w-4" />
              WHY IT MATTERS FOR INDIA
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 font-heading">
              Powering India&apos;s clean energy future
            </h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 text-center space-y-2 hover:bg-slate-50 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto text-primary shadow-sm">
                <Sun className="h-5 w-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">283 GW</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-tight">
                Capacity Installed
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 text-center space-y-2 hover:bg-slate-50 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto text-primary shadow-sm">
                <Wind className="h-5 w-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">500 GW</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-tight">
                2030 Target
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 text-center space-y-2 hover:bg-slate-50 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto text-primary shadow-sm">
                <Building className="h-5 w-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">$12B+</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-tight">
                Solar Market by 2026
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 text-center space-y-2 hover:bg-slate-50 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto text-primary shadow-sm">
                <Layers className="h-5 w-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">0</div>
              <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-tight">
                Workflows Tailored
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-4">
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-sans">
              Every one of those gigawatts needs to be inspected, stage by stage, before it can be commissioned. Right now, all of that coordination is happening over WhatsApp. That is the gap this tool fills.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-primary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--secondary),transparent_50%)] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_35%)] opacity-20 pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-6 relative z-10 space-y-8">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight">
            Your next inspection starts today.
          </h3>
          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans">
            Eliminate loose WhatsApp messages and phone call trails. Put all owners, inspectors, and engineers on a single, secure page.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3.5">
            <Button
              asChild
              className="bg-primary text-white hover:bg-primary/95 text-xs font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Link href="/login">
                Launch Compliance Workbench
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/10 hover:bg-white/10 text-white hover:text-white text-xs font-bold h-12 px-8 rounded-xl backdrop-blur-md cursor-pointer"
            >
              <Link href="/">View Standard Landing Page</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-6 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-bold text-slate-800 font-heading text-sm">InspectFlow</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} InspectFlow. All rights reserved. Built for India Grid Compliance.
          </div>
        </div>
      </footer>
    </div>
  );
}
