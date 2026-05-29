import { notFound } from "next/navigation";
import { Layers, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { getProject, getProjectDashboard } from "@/app/actions/projects";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, dashboard] = await Promise.all([
    getProject(id),
    getProjectDashboard(id),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-5">
      {/* Metric cards */}
      {dashboard && (
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Total stages"
            value={dashboard.metrics.totalStages}
            icon={Layers}
            themeStyle="text-indigo-600 bg-indigo-50 border-indigo-100"
          />
          <MetricCard
            label="Completed stages"
            value={dashboard.metrics.completedStages}
            icon={CheckCircle2}
            themeStyle="text-emerald-600 bg-emerald-50 border-emerald-100"
          />
          <MetricCard
            label="Pending stages"
            value={dashboard.metrics.pendingStages}
            icon={Clock}
            themeStyle="text-amber-600 bg-amber-50 border-amber-100"
          />
        </div>
      )}

      {/* Project summary */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-foreground font-heading">Project Overview</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Welcome to the project compliance dashboard overview. Monitor configuration stages,
          request third-party compliance reviews, coordinate assignments, and monitor inline
          checklists. Click the <strong>Stages</strong> tab above to access the interactive
          project stages, checkpoints checklist, and dispatch compliance inspections.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={`/dashboard/projects/${id}/stages`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-slate-50 hover:bg-slate-100 text-sm font-bold text-slate-800 transition-all"
          >
            Go to Stages Pipeline &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  themeStyle,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  themeStyle: string;
}) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-white shadow-sm flex items-center justify-between group hover:border-primary/20 hover:shadow-md transition-all duration-200">
      <div className="space-y-1">
        <p className="text-3xl font-extrabold text-foreground tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground font-semibold">{label}</p>
      </div>
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${themeStyle} transition-transform duration-300 group-hover:scale-105`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
