"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Users, 
  Smartphone, 
  FileText, 
  Check, 
  Link as LinkIcon, 
  Mail, 
  Grid, 
  Zap, 
  Info,
  ChevronRight,
  Database,
  Lock,
  Layers,
  Sparkles,
  ArrowUpRight,
  Building,
  Wind,
  Sun,
  Droplets,
  Flame,
  Factory,
  MapPin,
  Plus,
  Briefcase,
  FileUp,
  UserCheck,
  Award,
  Play,
  Share2,
  Camera,
  X
} from "lucide-react";

export default function Home() {
  // Interactive prototype state
  // Workflow stages: 
  // 1. "epc-draft" (EPC preparing checklist)
  // 2. "tpi-invited" (TPI scheduling pending)
  // 3. "tpi-signed-off" (TPI validated, pending Owner review)
  // 4. "owner-approved" (Owner approved & stage locked)
  const [workflowState, setWorkflowState] = useState<"epc-draft" | "tpi-invited" | "tpi-signed-off" | "owner-approved">("epc-draft");
  const [activeTab, setActiveTab] = useState<"epc" | "tpi" | "owner">("epc");
  const [checklistItems, setChecklistItems] = useState([
    { id: 1, text: "Reinforcement Steel Mesh Reinbar Tension Test", checked: true },
    { id: 2, text: "Concrete Pour Slump Test & Air Content", checked: true },
    { id: 3, text: "Anchor Bolt Alignment & Level Verification", checked: false },
  ]);
  const [tpiInput, setTpiInput] = useState("");
  const [tpiStatus, setTpiStatus] = useState<"pending" | "accepted">("pending");

  const toggleChecklistItem = (id: number) => {
    if (workflowState !== "epc-draft") return;
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleEpcSubmit = () => {
    setWorkflowState("tpi-invited");
    setActiveTab("tpi");
  };

  const handleTpiAccept = () => {
    setTpiStatus("accepted");
  };

  const handleTpiSignoff = () => {
    setWorkflowState("tpi-signed-off");
    setActiveTab("owner");
  };

  const handleOwnerApprove = () => {
    setWorkflowState("owner-approved");
  };

  const resetPrototype = () => {
    setWorkflowState("epc-draft");
    setTpiStatus("pending");
    setChecklistItems([
      { id: 1, text: "Reinforcement Steel Mesh Reinbar Tension Test", checked: true },
      { id: 2, text: "Concrete Pour Slump Test & Air Content", checked: true },
      { id: 3, text: "Anchor Bolt Alignment & Level Verification", checked: false },
    ]);
    setActiveTab("epc");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Inspect<span className="text-primary">Flow</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-muted-foreground">
            <a href="#problems" className="hover:text-primary transition-colors">Challenges</a>
            <a href="#demo" className="hover:text-primary transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Process</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold px-4 cursor-pointer">
              Book Demo
            </Button>
            <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90 font-semibold shadow-sm rounded-xl text-xs px-5 cursor-pointer">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 bg-gradient-to-b from-secondary/35 via-white to-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Details */}
            <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
              <div className="inline-flex self-center lg:self-start items-center gap-1.5 rounded-full bg-secondary text-secondary-foreground border border-primary/20 px-3.5 py-1 text-xs font-extrabold mb-6 tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Designed for Renewables & Heavy Infrastructure
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground sm:leading-none lg:text-6xl font-heading leading-tight">
                Your wind park passed inspection.
                <span className="block text-primary mt-2">Prove it — instantly.</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                From foundation to commissioning, track every stage, every inspector visit, and every sign-off. Full audit trail built for lenders and insurers.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="h-12 px-6 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl shadow-md shadow-primary/10 cursor-pointer">
                  <Link href="/login">
                    Start your first project free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-6 border-border hover:bg-muted text-xs font-bold rounded-xl cursor-pointer">
                  Book a 20-min demo
                </Button>
              </div>

              {/* Enhanced Hero Icon Badges */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border/80 pt-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span>10-min setup</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                  </div>
                  <span>Inspectors free</span>
                </div>
              </div>
            </div>

            {/* Hero Dashboard Preview */}
            <div className="lg:col-span-6 relative w-full">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-transparent rounded-3xl blur-2xl -z-10 animate-pulse duration-4000" />
              
              {/* Desktop Mockup Box */}
              <div className="w-full bg-white rounded-2xl border border-border shadow-2xl overflow-hidden">
                {/* Window header */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground select-none">
                    inspectflow.app/projects/wind-park-iv
                  </div>
                  <div className="w-8" />
                </div>

                {/* Dashboard Header Preview */}
                <div className="p-5 border-b border-border bg-white">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-100">
                        <Wind className="h-5.5 w-5.5" />
                      </div>
                      <div>
                        <div className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider">PROJECT OVERVIEW</div>
                        <h3 className="text-sm font-bold text-foreground">Greenfield Wind Park IV</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-[10px] font-extrabold border border-primary/20">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Stage 3: Foundation Cure
                    </div>
                  </div>

                  {/* Stages Progress Tracker */}
                  <div className="grid grid-cols-4 gap-2.5 mt-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="h-2 rounded bg-primary" />
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider hidden sm:inline">1. Excavation</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-2 rounded bg-primary" />
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider hidden sm:inline">2. Steel Reinbar</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-2 rounded bg-primary animate-pulse" />
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider hidden sm:inline">3. Concrete Pour</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-2 rounded bg-muted" />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:inline">4. Turbine Assembly</span>
                    </div>
                  </div>
                </div>

                {/* Main panel inner preview */}
                <div className="p-5 bg-muted/20">
                  <div className="flex flex-col gap-4">
                    {/* Stage status alert banner */}
                    <div className="flex items-start gap-3.5 p-4 bg-white rounded-2xl border border-border shadow-sm">
                      <div className="p-2.5 bg-secondary rounded-xl text-primary shrink-0">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <span className="text-xs font-bold text-foreground truncate">Foundation Concrete Cure Validation</span>
                          <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full shrink-0">In Progress</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Checking slump properties, core compression logs, and anchor bolt alignment checks.
                        </p>
                      </div>
                    </div>

                    {/* Inspection details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left: Checklists */}
                      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">On-site Checkpoints</span>
                          <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                              <span className="line-through text-muted-foreground text-[11px]">Concrete cube compression results</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                              <span className="line-through text-muted-foreground text-[11px]">ISO certified slump measurements</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <Clock className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                              <span className="font-semibold text-foreground text-[11px]">Anchor bolt vertical alignment</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Inspector Status */}
                      <div className="bg-white p-4 rounded-2xl border border-border flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">Third-Party Inspector</span>
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-extrabold text-primary">
                              TPI
                            </div>
                            <div>
                              <div className="text-xs font-bold text-foreground">Bureau Veritas (S. Miller)</div>
                              <div className="text-[10px] text-muted-foreground">External auditor role</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground text-[11px] font-medium">Deadline:</span>
                          <span className="font-bold text-destructive flex items-center gap-1 text-[11px]">
                            <Clock className="h-3.5 w-3.5" /> 24 Hours Left
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem Section ("Sound familiar?") */}
      <section id="problems" className="py-20 bg-white border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-heading">PROJECT ROADBLOCKS</h2>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              Sound familiar?
            </p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              Managing heavy infrastructure stages shouldn't feel like chasing deliveries. Yet teams continue to struggle with fragmented systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            
            {/* Card 1 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-6 border border-amber-200/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-3 font-heading">
                Inspector scheduling is a WhatsApp nightmare
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                EPC teams chase third-party inspectors via messages, phone calls, and personal email accounts. There is absolutely no central log of who confirmed, who rejected, or when they promised to be on site.
              </p>
              <ul className="space-y-2 text-xs font-bold text-foreground border-t border-border/60 pt-3">
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Fragmented WhatsApp group chats</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Chasing inspectors on phone calls</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>No calendar or schedule trace log</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-destructive rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive mb-6 border border-destructive-200/20">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-3 font-heading">
                Missed inspections delay commissioning — and cost money
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                When an inspector doesn’t show up and nobody gets notified, critical site concrete pours wait. Timelines slip, and standby fees run into thousands of dollars a day without any accountability.
              </p>
              <ul className="space-y-2 text-xs font-bold text-foreground border-t border-border/60 pt-3">
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Delays to concrete pours</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Expensive standby crew fees</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Zero accountability or alerts</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 border border-primary-200/20">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-3 font-heading">
                Audit trails live in email folders and spreadsheets
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Lenders and insurers demand a full proof audit trail before releasing project milestones. Assembling photos, PDF sign-offs, and compliance certificates across dozens of emails takes days.
              </p>
              <ul className="space-y-2 text-xs font-bold text-foreground border-t border-border/60 pt-3">
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Insurer milestone holds</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Chasing site photos in email</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Days spent compiling PDFs</span>
                </li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="group relative bg-white p-8 rounded-2xl border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-foreground rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground mb-6 border border-border">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-extrabold text-foreground mb-3 font-heading">
                Generic tools don't understand EPC workflows
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                Procore is built for generic building construction. SafetyCulture is optimized for manufacturing floors. Neither supports third-party inspector links, stage sign-offs, or EPC-owner approval flows.
              </p>
              <ul className="space-y-2 text-xs font-bold text-foreground border-t border-border/60 pt-3">
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>Procore is built for buildings</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>SafetyCulture is for factory floors</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive shrink-0" />
                  <span>No multi-role sign-off flows</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Prototype Sandbox Section */}
      <section id="demo" className="py-20 bg-secondary/15">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                <Play className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-heading">LIVE INTERACTIVE PLAYGROUND</h2>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              Try InspectFlow in 60 seconds
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Experience the core 3-way workflow loop. Toggle between roles to see how EPC engineers, inspectors, and owners interact in real-time.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-xl overflow-hidden max-w-4xl mx-auto">
            {/* Playground Navigation / Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/65 border-b border-border px-4 py-2 gap-2">
              <div className="flex items-center gap-1.5 bg-white/60 p-1.5 rounded-xl border border-border/80 self-start">
                <button
                  onClick={() => setActiveTab("epc")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "epc"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  1. EPC Engineer
                </button>
                <button
                  onClick={() => setActiveTab("tpi")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "tpi"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  2. TPI Link (External)
                </button>
                <button
                  onClick={() => setActiveTab("owner")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === "owner"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  3. Project Owner
                </button>
              </div>

              {/* Status bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground font-extrabold tracking-wider uppercase">FLOW STATE:</span>
                <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                  workflowState === "epc-draft" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                  workflowState === "tpi-invited" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                  workflowState === "tpi-signed-off" ? "bg-purple-50 text-purple-800 border border-purple-200" :
                  "bg-emerald-50 text-emerald-800 border border-emerald-200"
                }`}>
                  {workflowState.replace("-", " ")}
                </span>
                
                {(workflowState !== "epc-draft" || activeTab !== "epc") && (
                  <button onClick={resetPrototype} className="text-xs text-primary font-bold hover:underline ml-2 cursor-pointer">
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
              
              {/* Tab 1: EPC VIEW */}
              {activeTab === "epc" && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-base font-bold text-foreground flex items-center gap-2 font-heading">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-primary text-xs font-bold border border-primary/20">1</span>
                      EPC Workspace - Prepare Concrete Pour Stage
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check your stage requirements. Once concrete checkmarks are completed, generate the secure TPI inspector link.
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="bg-muted/30 p-5 rounded-2xl border border-border">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">On-site Quality Checklist</span>
                    <div className="flex flex-col gap-3">
                      {checklistItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklistItem(item.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all select-none ${
                            workflowState === "epc-draft" ? "cursor-pointer hover:bg-white" : "opacity-80"
                          } ${
                            item.checked 
                              ? "bg-white border-primary/25 text-foreground shadow-sm" 
                              : "bg-white/40 border-border text-muted-foreground"
                          }`}
                        >
                          <div className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all ${
                            item.checked ? "bg-primary border-primary text-white" : "border-border"
                          }`}>
                            {item.checked && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
                          </div>
                          <span className="text-xs font-bold text-foreground">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Block */}
                  <div className="flex items-center justify-between border-t border-border/80 pt-4 mt-2">
                    <div className="text-xs text-muted-foreground max-w-sm font-semibold">
                      {workflowState === "epc-draft" ? (
                        <span>Completing all items enables the <strong>Inspector Inviter</strong>.</span>
                      ) : (
                        <span className="text-primary font-bold flex items-center gap-1">
                          <Check className="h-4 w-4" /> Link successfully generated! Switch to Tab 2 to view what the Inspector sees.
                        </span>
                      )}
                    </div>
                    {workflowState === "epc-draft" ? (
                      <Button
                        onClick={handleEpcSubmit}
                        disabled={!checklistItems.every((item) => item.checked)}
                        className="bg-primary text-white hover:bg-primary/90 font-bold rounded-xl text-xs px-5 py-4 cursor-pointer"
                      >
                        Generate Inspector Link
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setActiveTab("tpi")}
                        variant="secondary"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 font-bold rounded-xl text-xs px-5 py-4 cursor-pointer"
                      >
                        View Inspector Link
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: TPI LINK VIEW */}
              {activeTab === "tpi" && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-base font-bold text-foreground flex items-center gap-2 font-heading">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-primary text-xs font-bold border border-primary/20">2</span>
                      Inspector Portal (Zero-Install Access)
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Third-party inspectors receive this via SMS/Email. No app download or registration. They inspect, confirm, and sign off.
                    </p>
                  </div>

                  {workflowState === "epc-draft" ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
                      <Lock className="h-8 w-8 text-muted-foreground/60 mb-2 animate-bounce" />
                      <p className="text-sm font-bold text-muted-foreground">Link not generated yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Please complete the EPC checklist in step 1 to generate this link.</p>
                      <Button onClick={() => setActiveTab("epc")} size="sm" className="mt-4 bg-primary text-white rounded-xl text-xs font-semibold cursor-pointer">
                        Go to Step 1
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {/* Secure Link Details */}
                      <div className="bg-secondary/50 p-3.5 rounded-xl border border-primary/10 flex items-center justify-between text-xs">
                        <span className="text-secondary-foreground font-bold flex items-center gap-1.5 truncate">
                          <LinkIcon className="h-3.5 w-3.5 text-primary" />
                          inspectflow.app/shared/token-91x0a-foundation-check
                        </span>
                        <span className="text-muted-foreground font-bold text-[10px] tracking-wider uppercase shrink-0 hidden sm:inline ml-3">Bureau Veritas Link</span>
                      </div>

                      {tpiStatus === "pending" ? (
                        /* Invite acceptance step */
                        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div>
                            <div className="text-sm font-bold text-foreground">Accept Inspection Invitation</div>
                            <p className="text-xs text-muted-foreground mt-1">Confirm you will perform the inspection on-site by May 28, 2026.</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="outline" className="border-border text-xs rounded-xl font-bold hover:bg-muted cursor-pointer">Reject</Button>
                            <Button onClick={handleTpiAccept} className="bg-primary text-white text-xs font-bold rounded-xl cursor-pointer">Accept & Schedule</Button>
                          </div>
                        </div>
                      ) : (
                        /* Validate & Sign-off step */
                        <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-bold text-foreground">Submit Inspection Results</div>
                              <p className="text-xs text-muted-foreground mt-1">Upload on-site evidence and sign off independently.</p>
                            </div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-secondary px-2.5 py-0.5 rounded-full border border-primary/20">Visit Scheduled</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Tension Meter Log</label>
                              <input 
                                type="text" 
                                placeholder="Value (e.g. 240 kN)" 
                                value={tpiInput}
                                onChange={(e) => setTpiInput(e.target.value)}
                                className="h-10 border border-border rounded-xl px-3 text-xs bg-background focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase">Upload Concrete Core photo</label>
                              <div className="h-10 border border-dashed border-border hover:border-primary/45 rounded-xl flex items-center justify-center text-xs text-muted-foreground bg-muted/20 cursor-pointer">
                                📷 Click to upload photo (JPEG/PNG)
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 border-t border-border/60 pt-4 mt-2">
                            {workflowState === "tpi-invited" ? (
                              <Button 
                                onClick={handleTpiSignoff}
                                disabled={!tpiInput}
                                className="bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Sign Off & Submit
                              </Button>
                            ) : (
                              <span className="text-xs font-bold text-primary flex items-center gap-1">
                                <Check className="h-4 w-4" /> Signed off successfully! Switch to Tab 3 for Owner approval.
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {/* Tab 3: OWNER APPROVAL */}
              {activeTab === "owner" && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h4 className="text-base font-bold text-foreground flex items-center gap-2 font-heading">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-primary text-xs font-bold border border-primary/20">3</span>
                      Project Owner Approval Interface
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Owners receive notifications of completion. They review the full, immutable audit trail (EPC checklist + TPI measurements) and sign off.
                    </p>
                  </div>

                  {workflowState === "epc-draft" || workflowState === "tpi-invited" ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
                      <Lock className="h-8 w-8 text-muted-foreground/60 mb-2 animate-bounce" />
                      <p className="text-sm font-bold text-muted-foreground">Audit Trail Pending Submission</p>
                      <p className="text-xs text-muted-foreground mt-1">The third-party inspector must sign off and submit results before the owner reviews.</p>
                      <Button onClick={() => setActiveTab("tpi")} size="sm" className="mt-4 bg-primary text-white rounded-xl text-xs font-semibold cursor-pointer">
                        Go to Step 2
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {/* Complete Audit Summary */}
                      <div className="bg-muted/40 p-5 rounded-2xl border border-border text-xs flex flex-col gap-2.5 shadow-xs">
                        <span className="font-extrabold text-foreground uppercase tracking-wider block text-[10px]">Verification Summary Logs</span>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                          <span className="text-muted-foreground">EPC Checklist Items:</span>
                          <span className="font-bold text-primary flex items-center gap-1">
                            <Check className="h-3.5 w-3.5 stroke-[2.5px]" /> 3 of 3 Checked
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                          <span className="text-muted-foreground">TPI Inspector (BV):</span>
                          <span className="font-bold text-primary flex items-center gap-1">
                            <Check className="h-3.5 w-3.5 stroke-[2.5px]" /> Signed & Verified
                          </span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-muted-foreground">Tension Metre Reading:</span>
                          <span className="font-mono font-bold text-foreground">{tpiInput || "240 kN"}</span>
                        </div>
                      </div>

                      {workflowState === "tpi-signed-off" ? (
                        <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div>
                            <div className="text-sm font-bold text-foreground">Stage Release Review</div>
                            <p className="text-xs text-muted-foreground mt-1">Review the compliance record above. Approving will lock the audit trail forever.</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button variant="outline" className="border-border text-xs text-destructive hover:bg-destructive/10 rounded-xl font-bold cursor-pointer">Reject Stage</Button>
                            <Button onClick={handleOwnerApprove} className="bg-primary text-white text-xs font-bold rounded-xl cursor-pointer">Approve & Lock Stage</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-secondary/40 p-5 rounded-2xl border border-primary/10 text-center flex flex-col items-center gap-3 shadow-xs">
                          <CheckCircle2 className="h-10 w-10 text-primary animate-bounce" />
                          <div>
                            <div className="text-sm font-extrabold text-foreground">Stage Release Authorized & Locked</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">The audit trail is now locked in our compliance logs. PDF exported for insurers & lenders.</p>
                          </div>
                          <Button onClick={resetPrototype} size="sm" variant="outline" className="border-border text-xs mt-1 rounded-xl font-bold cursor-pointer">
                            Simulate Next Stage
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Feature Section ("Everything your inspection workflow needs") */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                <Grid className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-heading">FEATURE GRID</h2>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              Everything your inspection workflow needs
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Built specifically to replace the friction of generic software, manual forms, and endless chasing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4 border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                <LinkIcon className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">Inspector link scheduling</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Generate a secure link. Inspector accepts or rejects with a deadline. System tracks every status — scheduled, overdue, grace period — automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4 border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">Stage-by-stage workflow</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                From civil works to commissioning — each project stage has its own checklist, evidence upload, and multi-role sign-off.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4 border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">Pre-built EPC templates</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Wind park and solar farm stage libraries built in. Start a new project and your compliance checklist stages are ready in one click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4 border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">Owner approval flow</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                EPC records findings, inspector validates, and owner approves or rejects with comments. A clean digital decision trail is recorded.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4 border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                <Smartphone className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">Evidence capture on mobile</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Photos, documents, and measurements attached to individual checklist items — taken on-site, linked directly to the exact checkpoint.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4 border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">Compliance audit trail</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Every inspection, every visit, every decision — timestamped and exportable as PDF. Ready for lenders and insurers on demand.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4 border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">Automatic deadline tracking</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                System monitors every inspection window. Missed deadline? EPC and owner are notified immediately. Grace periods assigned automatically.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary mb-4 border border-primary/10 transition-transform duration-300 group-hover:scale-105">
                <Database className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground mb-2">Secure hosting and storage</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                All uploaded blueprints, photos, and compliance logs are securely stored and accessible to key project partners.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-heading">THE COMPLIANCE CYCLE</h2>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              From stage start to sign-off in 4 steps
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              A structured progress loop designed to eliminate bottlenecks, minimize stand-by fees, and secure owner approvals.
            </p>
          </div>

          <div className="relative">
            {/* Desktop Connector line */}
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2 hidden lg:block -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-border relative flex flex-col justify-between h-full hover:border-primary/20 hover:shadow-md transition-all group">
                <div>
                  <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-xs text-primary-foreground shadow-sm">
                    01
                  </div>
                  <div className="flex items-center justify-between mt-2 mb-3">
                    <h4 className="text-sm font-bold text-foreground">EPC starts a stage</h4>
                    <FileText className="h-4 w-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                    Add checklist items, attach IEC/ISO standard references. Mark the stage ready for inspection.
                  </p>
                  <ul className="space-y-1.5 text-[10px] font-semibold text-muted-foreground border-t border-border/60 pt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Load stage checklists</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Attach standards documentation</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Set status to Ready</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 text-[10px] font-bold text-primary uppercase tracking-wider">Step 1 of 4</div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-border relative flex flex-col justify-between h-full hover:border-primary/20 hover:shadow-md transition-all group">
                <div>
                  <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-xs text-primary-foreground shadow-sm">
                    02
                  </div>
                  <div className="flex items-center justify-between mt-2 mb-3">
                    <h4 className="text-sm font-bold text-foreground">Generate inspector link</h4>
                    <Share2 className="h-4 w-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                    Send a secure link to your third-party inspector. They accept, confirm a visit window, and show up on site.
                  </p>
                  <ul className="space-y-1.5 text-[10px] font-semibold text-muted-foreground border-t border-border/60 pt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Secure external URL link</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Confirm visit timeline window</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>No account required</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 text-[10px] font-bold text-primary uppercase tracking-wider">Step 2 of 4</div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-border relative flex flex-col justify-between h-full hover:border-primary/20 hover:shadow-md transition-all group">
                <div>
                  <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-xs text-primary-foreground shadow-sm">
                    03
                  </div>
                  <div className="flex items-center justify-between mt-2 mb-3">
                    <h4 className="text-sm font-bold text-foreground">Inspector validates on site</h4>
                    <Camera className="h-4 w-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                    Inspector fills their own checklist, uploads photos and measurements. Both EPC and inspector sign off independently.
                  </p>
                  <ul className="space-y-1.5 text-[10px] font-semibold text-muted-foreground border-t border-border/60 pt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Photo evidence capture</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Field metrics validation logs</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Dual digital signature logs</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 text-[10px] font-bold text-primary uppercase tracking-wider">Step 3 of 4</div>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-border relative flex flex-col justify-between h-full hover:border-primary/20 hover:shadow-md transition-all group">
                <div>
                  <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-xs text-primary-foreground shadow-sm">
                    04
                  </div>
                  <div className="flex items-center justify-between mt-2 mb-3">
                    <h4 className="text-sm font-bold text-foreground">Owner approves</h4>
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                    Stage submitted to project owner for final review. Approve or reject with comments. Audit trail locked.
                  </p>
                  <ul className="space-y-1.5 text-[10px] font-semibold text-muted-foreground border-t border-border/60 pt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Real-time status updates</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>Immutable compliance lock</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-primary shrink-0" />
                      <span>PDF compliance pack export</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 text-[10px] font-bold text-primary uppercase tracking-wider">Step 4 of 4</div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Details */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                  <Award className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-heading">THE InspectFlow DIFFERENCE</h2>
              </div>
              <h3 className="mt-3 text-3xl font-extrabold text-foreground leading-tight font-heading">
                Why teams choose InspectFlow over Procore or SafetyCulture
              </h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                General construction tools treat inspection scheduling as an afterthought. Spreadsheets are highly risk-prone. We built the only tool focused purely on heavy infrastructure stage release.
              </p>
              
              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-secondary rounded-lg text-primary shrink-0">
                    <Check className="h-4 w-4 stroke-[3px]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Link-based scheduling for TPI</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">No other tool lets external inspectors schedule and confirm directly without accounts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-secondary rounded-lg text-primary shrink-0">
                    <Check className="h-4 w-4 stroke-[3px]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Zero-friction app-free submissions</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Inspectors just open a text message link, upload photos, fill checklists, and sign off.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 bg-secondary rounded-lg text-primary shrink-0">
                    <Check className="h-4 w-4 stroke-[3px]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Renewable templates built-in</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Start projects pre-configured with solar farm and wind park stage checklists.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Comparison Table */}
            <div className="lg:col-span-7 bg-muted/20 p-6 rounded-2xl border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border/80">
                      <th className="py-3 font-bold text-foreground">Workflow Core Feature</th>
                      <th className="py-3 font-bold text-primary text-center">InspectFlow</th>
                      <th className="py-3 font-medium text-muted-foreground text-center">Procore</th>
                      <th className="py-3 font-medium text-muted-foreground text-center">Excel</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/40">
                      <td className="py-3.5 font-medium text-foreground">External Inspector Link Scheduling</td>
                      <td className="py-3.5 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-primary mx-auto" /></td>
                      <td className="py-3.5 text-center"><XCircle className="h-4.5 w-4.5 text-muted-foreground/40 mx-auto" /></td>
                      <td className="py-3.5 text-center"><XCircle className="h-4.5 w-4.5 text-muted-foreground/40 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-3.5 font-medium text-foreground">App-Free External Checklists</td>
                      <td className="py-3.5 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-primary mx-auto" /></td>
                      <td className="py-3.5 text-center"><XCircle className="h-4.5 w-4.5 text-muted-foreground/40 mx-auto" /></td>
                      <td className="py-3.5 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-primary/40 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-3.5 font-medium text-foreground">Renewable Stage Libraries</td>
                      <td className="py-3.5 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-primary mx-auto" /></td>
                      <td className="py-3.5 text-center"><XCircle className="h-4.5 w-4.5 text-muted-foreground/40 mx-auto" /></td>
                      <td className="py-3.5 text-center"><XCircle className="h-4.5 w-4.5 text-muted-foreground/40 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-border/40">
                      <td className="py-3.5 font-medium text-foreground">Automatic Grace-Period Tracking</td>
                      <td className="py-3.5 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-primary mx-auto" /></td>
                      <td className="py-3.5 text-center"><XCircle className="h-4.5 w-4.5 text-muted-foreground/40 mx-auto" /></td>
                      <td className="py-3.5 text-center"><XCircle className="h-4.5 w-4.5 text-muted-foreground/40 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3.5 font-medium text-foreground">Immutable Lenders Audit Logs</td>
                      <td className="py-3.5 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-primary mx-auto" /></td>
                      <td className="py-3.5 text-center"><CheckCircle2 className="h-4.5 w-4.5 text-primary/60 mx-auto" /></td>
                      <td className="py-3.5 text-center"><XCircle className="h-4.5 w-4.5 text-muted-foreground/40 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
                <Award className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary font-heading">TRANSPARENT PLANS</h2>
            </div>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
              Simple pricing. No seat fees for inspectors.
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Choose the volume you need. TPI users are always free — we never bill per external seat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-4xl mx-auto">
            
            {/* Tier 1 */}
            <div className="bg-white p-8 rounded-2xl border border-border flex flex-col justify-between relative hover:border-primary/20 hover:shadow-md transition-all">
              <div>
                <h4 className="text-base font-bold text-foreground">Starter</h4>
                <p className="text-[11px] text-muted-foreground mt-1">Best for single project compliance.</p>
                
                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">$199</span>
                  <span className="text-xs text-muted-foreground font-semibold ml-2">/ month</span>
                </div>

                <ul className="mt-8 flex flex-col gap-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span className="text-foreground font-bold">1 active project</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>Up to 15 users</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>All standard roles included</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>Standard email support</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Button asChild variant="outline" className="w-full border-border hover:bg-muted font-bold text-xs py-5 rounded-xl cursor-pointer">
                  <Link href="/login">Start free trial</Link>
                </Button>
              </div>
            </div>

            {/* Tier 2: POPULAR */}
            <div className="bg-white p-8 rounded-2xl border-2 border-primary flex flex-col justify-between relative shadow-lg hover:shadow-xl transition-all">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-primary-foreground text-[9px] font-extrabold uppercase px-3 py-1 rounded-full border border-primary shadow-sm tracking-wider">
                Most Popular
              </div>

              <div>
                <h4 className="text-base font-bold text-foreground">Growth</h4>
                <p className="text-[11px] text-muted-foreground mt-1">Best for small EPC contractor teams.</p>
                
                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">$599</span>
                  <span className="text-xs text-muted-foreground font-semibold ml-2">/ month</span>
                </div>

                <ul className="mt-8 flex flex-col gap-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span className="text-foreground font-bold">Up to 5 active projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span className="text-foreground font-semibold">Unlimited user seats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>Instant PDF audit reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>Overdue deadline automations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>Priority email & chat support</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/95 font-bold text-xs py-5 shadow-sm shadow-primary/10 rounded-xl cursor-pointer">
                  <Link href="/login">Start free trial</Link>
                </Button>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="bg-white p-8 rounded-2xl border border-border flex flex-col justify-between relative hover:border-primary/20 hover:shadow-md transition-all">
              <div>
                <h4 className="text-base font-bold text-foreground">Enterprise</h4>
                <p className="text-[11px] text-muted-foreground mt-1">Best for multi-site global EPC portfolios.</p>
                
                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-extrabold text-foreground tracking-tight">Custom</span>
                </div>

                <ul className="mt-8 flex flex-col gap-3.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span className="text-foreground font-bold">Unlimited active projects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>Dedicated onboarding engineer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>SLA uptime guarantee</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>Custom stage template design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>Full REST API access</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Button variant="outline" className="w-full border-border hover:bg-muted font-bold text-xs py-5 rounded-xl cursor-pointer">
                  Contact us
                </Button>
              </div>
            </div>

          </div>

          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary/80 text-xs font-semibold text-secondary-foreground border border-primary/10">
              <Info className="h-3.5 w-3.5 text-primary" />
              Inspectors always free — external TPI users are never charged.
            </span>
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Background glow styling */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--primary-foreground),transparent)] opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary-foreground),transparent)] opacity-10" />

        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-heading">
            Your next inspection starts today.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            Set up your first project in under 10 minutes. Invite inspectors immediately. No credit card required.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="ghost" className="bg-white text-primary hover:bg-white/90 hover:text-primary font-extrabold h-12 px-8 rounded-xl text-xs cursor-pointer">
              <Link href="/login">Start free — no credit card needed</Link>
            </Button>
            <Button size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10 hover:text-white font-bold h-12 px-6 rounded-xl text-xs cursor-pointer">
              Request Info Pack
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-bold text-white/60 tracking-wider uppercase">
            <span>✓ Up to 15 users in starter trial</span>
            <span>✓ Cancel at any time</span>
            <span>✓ Data hosted in Compliance Nodes</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-muted-foreground border-t border-border/10 py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 text-white">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="text-lg font-extrabold tracking-tight">
                  Inspect<span className="text-primary">Flow</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3 leading-relaxed">
                Purpose-built inspection & stage release software for renewable energy and industrial EPC projects.
              </p>
            </div>

            {/* Column 1 */}
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-4">Product</span>
              <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground/75">
                <li><a href="#features" className="hover:text-primary transition-colors">Features Grid</a></li>
                <li><a href="#demo" className="hover:text-primary transition-colors">Interactive Demo</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing Tiers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API documentation</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-4">Templates</span>
              <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground/75">
                <li><a href="#" className="hover:text-primary transition-colors">Wind Park Stage Library</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Solar PV Array Checklist</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Hydro Turbine Commissioning</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">ISO 9001 Compliance</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-4">Company</span>
              <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground/75">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security & Trust Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Lenders Compliance Guide</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground/45 gap-4">
            <span>© {new Date().getFullYear()} InspectFlow Technologies Inc. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">SLA Agreement</a>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
