"use client";

import { useActionState, useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Layers,
  Loader2,
  Mail,
  Pencil,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createProject } from "@/app/actions/projects";
import { inviteMember } from "@/app/actions/invitations";
import {
  createCustomStage,
  deleteProjectStage,
  getProjectStages,
  updateProjectStage,
  type StageActionState,
} from "@/app/actions/stages";
import { logout } from "@/app/actions/auth";
import type { IndustryType, ProjectStage, ProjectSummary } from "@/lib/types";
import { getTemplateDetails, type ProjectTemplateSummary, type ProjectTemplateDetail } from "@/app/actions/templates";

const STEPS = [
  { id: 1, title: "Project", description: "Create and clone templates", icon: FolderKanban },
  { id: 2, title: "EPC engineer", description: "Invite by email", icon: UserPlus },
  { id: 3, title: "Stages", description: "Customize if needed", icon: Layers },
] as const;

const INDUSTRIES: IndustryType[] = [
  "SOLAR",
  "WIND",
  "HYDRO",
  "OIL_GAS",
  "POWER_TRANSMISSION",
  "INDUSTRIAL_PLANT",
  "OTHER",
];

type InviteStatus = {
  error?: string;
  success?: string;
};

export default function OwnerSetupWizard({
  initialTemplates = [],
}: {
  initialTemplates?: ProjectTemplateSummary[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templateDetails, setTemplateDetails] = useState<ProjectTemplateDetail | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(false);

  const derivedIndustryType = initialTemplates.find(
    (t) => t.id === selectedTemplateId
  )?.industryType;

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplateId(templateId);
    setTemplateDetails(null);
    if (!templateId) return;

    setIsLoadingTemplate(true);
    try {
      const details = await getTemplateDetails(templateId);
      setTemplateDetails(details);
    } catch {
      setTemplateDetails(null);
    } finally {
      setIsLoadingTemplate(false);
    }
  };
  const [stages, setStages] = useState<ProjectStage[]>([]);
  const [inviteStatus, setInviteStatus] = useState<InviteStatus>({});
  const [stageError, setStageError] = useState<string | null>(null);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [isInviting, startInvite] = useTransition();
  const [isRefreshingStages, startRefreshStages] = useTransition();
  const [isDeletingStage, startDeleteStage] = useTransition();

  const [projectState, projectAction, isCreatingProject] = useActionState(
    createProject,
    undefined
  );
  const project: ProjectSummary | null = projectState?.project ?? null;
  const [customStageState, customStageAction, isCreatingStage] = useActionState(
    async (prev: StageActionState, formData: FormData) => {
      if (!project?.id) {
        return { error: "Create a project before adding stages." };
      }
      return createCustomStage(project.id, prev, formData);
    },
    undefined
  );

  const refreshStages = useCallback(
    (projectId: string) => {
      startRefreshStages(async () => {
        const nextStages = await getProjectStages(projectId);
        setStages(sortStages(nextStages));
      });
    },
    [startRefreshStages]
  );

  useEffect(() => {
    if (project?.id) {
      refreshStages(project.id);
    }
  }, [project?.id, refreshStages]);

  useEffect(() => {
    if (customStageState?.success && project?.id) {
      refreshStages(project.id);
    }
  }, [customStageState?.success, project?.id, refreshStages]);

  const handleInvite = (formData: FormData) => {
    if (!project?.id) return;

    const email = formData.get("email") as string;
    if (!email) {
      setInviteStatus({ error: "Email is required." });
      return;
    }

    setInviteStatus({});
    startInvite(async () => {
      const result = await inviteMember(project.id, email, "EPC_ENGINEER");
      if (result.success) {
        setInviteStatus({
          success: `Invitation sent to ${email}. They can register or accept with the emailed token link.`,
        });
      } else {
        setInviteStatus({ error: result.error || "Failed to send invitation." });
      }
    });
  };

  const handleUpdateStage = (stageId: string, formData: FormData) => {
    if (!project?.id) return;
    setStageError(null);
    startRefreshStages(async () => {
      const result = await updateProjectStage(project.id, stageId, formData);
      if (result?.error) {
        setStageError(result.error);
        return;
      }
      setEditingStageId(null);
      refreshStages(project.id);
    });
  };

  const handleDeleteStage = (stageId: string) => {
    if (!project?.id || !confirm("Delete this project stage?")) return;

    setStageError(null);
    startDeleteStage(async () => {
      const result = await deleteProjectStage(project.id, stageId);
      if (result?.error) {
        setStageError(result.error);
        return;
      }
      refreshStages(project.id);
    });
  };

  const finishSetup = () => {
    router.push(project ? `/dashboard/projects/${project.id}` : "/dashboard/projects");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-10 border-b border-border bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Inspect<span className="text-primary">Flow</span>
            </span>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm" className="text-xs">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Owner onboarding
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Create the project, then invite the EPC engineer
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Project creation clones the stages and checkpoints from the selected blueprint template automatically.
            EPC engineers join through invitation links and add stage checkpoints after assignment.
          </p>
        </div>

        <nav aria-label="Setup progress" className="mb-10">
          <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isComplete = step > s.id;
              return (
                <li
                  key={s.id}
                  className={`rounded-xl border p-3 transition-all ${
                    isActive
                      ? "border-primary bg-secondary/60 shadow-sm"
                      : isComplete
                        ? "border-primary/40 bg-white"
                        : "border-border bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isComplete || isActive
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isComplete ? <Check className="h-3.5 w-3.5" /> : s.id}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                        <Icon className="hidden h-3 w-3 text-primary sm:inline" />
                        {s.title}
                      </div>
                      <p className="hidden truncate text-[10px] text-muted-foreground sm:block">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <FolderKanban className="h-5 w-5 text-primary" />
                  Step 1 - Owner creates the project
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  The backend creates the project and clones the stages and checkpoints from the selected blueprint template.
                </p>
              </div>

              <form action={projectAction} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wide">
                      Project name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      defaultValue="Nevada Solar Park Phase 1"
                      className="h-10 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="location" className="text-xs font-bold uppercase tracking-wide">
                      Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      defaultValue="Las Vegas, Nevada"
                      className="h-10 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="templateId" className="text-xs font-bold uppercase tracking-wide">
                      Select Project Blueprint / Template
                    </label>
                    <select
                      id="templateId"
                      name="templateId"
                      value={selectedTemplateId}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-sans"
                    >
                      <option value="">No Template (Blank Project)</option>
                      {initialTemplates.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="industryType" className="text-xs font-bold uppercase tracking-wide">
                      Industry type
                    </label>
                    {selectedTemplateId ? (
                      <input
                        id="industryTypeDisabled"
                        disabled
                        value={derivedIndustryType?.replace(/_/g, " ") || ""}
                        className="h-10 w-full rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground cursor-not-allowed font-medium"
                      />
                    ) : (
                      <select
                        id="industryType"
                        name="industryType"
                        required={!selectedTemplateId}
                        defaultValue="SOLAR"
                        className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-sans"
                      >
                        {INDUSTRIES.map((type) => (
                          <option key={type} value={type}>
                            {type.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    )}
                    {selectedTemplateId && (
                      <input type="hidden" name="industryType" value={derivedIndustryType || "OTHER"} />
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="startDate" className="text-xs font-bold uppercase tracking-wide">
                      Start date
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue="2026-06-01"
                      className="h-10 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="endDate" className="text-xs font-bold uppercase tracking-wide">
                      End date
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      defaultValue="2026-12-31"
                      className="h-10 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {isLoadingTemplate && (
                  <div className="flex items-center gap-2.5 p-4 rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading blueprint stages and checkpoints...</span>
                  </div>
                )}

                {templateDetails && (
                  <div className="p-5 rounded-xl border border-primary/10 bg-primary/[0.02] space-y-3.5 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-primary/5 pb-2">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                        Blueprint Preview: {templateDetails.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                        {templateDetails.defaultStages.length} Stages Cloned
                      </span>
                    </div>
                    {templateDetails.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">{templateDetails.description}</p>
                    )}
                    <div className="grid gap-2.5 sm:grid-cols-2 max-h-48 overflow-y-auto pr-1">
                      {templateDetails.defaultStages.map((stg) => (
                        <div key={stg.id} className="p-3 bg-white rounded-xl border border-border flex items-start gap-2.5">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] font-bold text-primary">
                            {stg.displayOrder}
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-foreground truncate">{stg.name}</h5>
                            <span className="text-[9px] text-muted-foreground font-semibold">
                              {stg.defaultCheckpoints?.length || 0} pre-seeded checkpoints
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-xs font-bold uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue="50MW solar array development"
                    className="w-full resize-y rounded-lg border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {projectState?.error && <ErrorBanner message={projectState.error} />}

                {project && (
                  <SuccessBanner
                    message={
                      selectedTemplateId
                        ? `Project ${project.name} created. Stages and checkpoints from the selected blueprint template were cloned successfully.`
                        : `Project ${project.name} created as a blank project.`
                    }
                  />
                )}

                <Button
                  type="submit"
                  disabled={isCreatingProject}
                  className="bg-primary text-white"
                >
                  {isCreatingProject ? "Creating..." : "Create project"}
                </Button>
              </form>

              <StepNav
                onNext={() => setStep(2)}
                nextDisabled={!project}
                nextLabel="Continue to EPC invite"
              />
            </div>
          )}

          {step === 2 && project && (
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Step 2 - Invite and assign the EPC engineer
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  The backend saves a pending invitation and emails a token link for registration or acceptance.
                </p>
              </div>

              <form action={handleInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wide">
                    EPC engineer email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="engineer@epccompany.com"
                    className="h-10 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <input type="hidden" name="role" value="EPC_ENGINEER" />

                {inviteStatus.error && <ErrorBanner message={inviteStatus.error} />}
                {inviteStatus.success && <SuccessBanner message={inviteStatus.success} />}

                <Button
                  type="submit"
                  disabled={isInviting}
                  className="bg-primary text-white"
                >
                  {isInviting ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Sending invitation...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                      Invite EPC engineer
                    </>
                  )}
                </Button>
              </form>

              <div className="rounded-xl border border-input/60 bg-secondary/50 p-4 text-xs text-muted-foreground">
                New invitees register through <strong className="text-foreground">POST /api/invitations/register</strong>.
                Existing authenticated users accept through <strong className="text-foreground">POST /api/invitations/accept</strong>.
              </div>

              <StepNav
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                nextLabel="Customize stages"
              />
            </div>
          )}

          {step === 3 && project && (
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Layers className="h-5 w-5 text-primary" />
                  Step 4 - Customize project stages
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review cloned defaults, add project-specific stages, or update stage details.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-7">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">
                      Project stages ({stages.length})
                    </h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isRefreshingStages}
                      onClick={() => refreshStages(project.id)}
                      className="text-xs"
                    >
                      {isRefreshingStages ? "Refreshing..." : "Refresh"}
                    </Button>
                  </div>

                  {stageError && <ErrorBanner message={stageError} />}

                  {stages.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      No stages returned yet. Add a custom stage or refresh after project creation completes.
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {stages.map((stage) => {
                        const isEditing = editingStageId === stage.id;
                        return (
                          <li key={stage.id} className="rounded-xl border border-border p-4">
                            {isEditing ? (
                              <form
                                action={(formData) => handleUpdateStage(stage.id, formData)}
                                className="space-y-3"
                              >
                                <input
                                  name="name"
                                  required
                                  defaultValue={stage.name}
                                  className="h-9 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <input
                                  name="description"
                                  defaultValue={stage.description || ""}
                                  placeholder="Stage description"
                                  className="h-9 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <input
                                  name="displayOrder"
                                  type="number"
                                  min={1}
                                  defaultValue={stage.displayOrder}
                                  className="h-9 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <div className="flex gap-2">
                                  <Button type="submit" size="sm" className="bg-primary text-white">
                                    Save stage
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingStageId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                                    Stage {stage.displayOrder}
                                  </p>
                                  <h4 className="text-sm font-bold text-foreground">{stage.name}</h4>
                                  {stage.description && (
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      {stage.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex shrink-0 gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setEditingStageId(stage.id)}
                                    title="Edit stage"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    disabled={isDeletingStage}
                                    className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                                    onClick={() => handleDeleteStage(stage.id)}
                                    title="Delete stage"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="space-y-4 lg:col-span-5">
                  <div className="rounded-xl border border-border p-5">
                    <h3 className="text-sm font-bold text-foreground">Add custom stage</h3>
                    <p className="mb-4 mt-1 text-xs text-muted-foreground">
                      Use this for project-specific work beyond the cloned industry defaults.
                    </p>
                    <form action={customStageAction} className="space-y-3">
                      <input
                        name="name"
                        required
                        placeholder="Grid Interconnection Stage"
                        className="h-9 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        name="description"
                        placeholder="Connecting transformers to transmission line"
                        className="h-9 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <input
                        name="displayOrder"
                        type="number"
                        min={1}
                        defaultValue={Math.max(stages.length + 1, 1)}
                        className="h-9 w-full rounded-lg border border-input px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {customStageState?.error && <ErrorBanner message={customStageState.error} />}
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={isCreatingStage}
                        className="w-full"
                      >
                        {isCreatingStage ? "Adding..." : "Add custom stage"}
                      </Button>
                    </form>
                  </div>

                  <div className="rounded-xl border border-input/60 bg-secondary/50 p-5 text-center">
                    <Check className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm font-bold text-foreground">Ready for checkpoints</p>
                    <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                      Assigned EPC engineers can add checkpoint items inside each stage.
                    </p>
                    <Button
                      type="button"
                      onClick={finishSetup}
                      className="mt-4 bg-primary text-white"
                    >
                      Go to project dashboard
                    </Button>
                  </div>
                </div>
              </div>

              <StepNav onBack={() => setStep(2)} showNext={false} />
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help? See the{" "}
          <Link href="/" className="font-semibold text-primary hover:underline">
            product overview
          </Link>
        </p>
      </main>
    </div>
  );
}

function sortStages(stages: ProjectStage[]) {
  return [...stages].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-red-200/60 bg-red-50 p-3 text-xs text-red-800"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-emerald-200/60 bg-emerald-50 p-3 text-xs text-emerald-800">
      <Check className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Continue",
  showNext = true,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showNext?: boolean;
}) {
  return (
    <div className="mt-2 flex items-center justify-between border-t border-border pt-6">
      {onBack ? (
        <Button type="button" variant="outline" onClick={onBack} className="text-xs">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      ) : (
        <span />
      )}
      {showNext && onNext && (
        <Button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="bg-primary text-xs text-white"
        >
          {nextLabel}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
