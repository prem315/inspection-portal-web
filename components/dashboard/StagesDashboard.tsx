"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Paperclip,
  Loader2,
  X,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
  Ruler,
  Download,
  ExternalLink,
} from "lucide-react";
import { updateCheckpointResult } from "@/app/actions/checkpoints";
import {
  getPresignedUrl,
  createEvidence,
  getEvidence,
  getEvidenceDetail,
} from "@/app/actions/evidence";
import CreateInspectionRequestModal from "./CreateInspectionRequestModal";
import CreateCheckpointForm from "./CreateCheckpointForm";
import type { Checkpoint, CheckpointResult } from "@/lib/types";

interface StageWithDetails {
  id: string;
  name: string;
  description?: string;
  status: string;
  displayOrder: number;
  checkpoints: Checkpoint[];
  requests: any[];
}

interface EvidenceItem {
  id: string;
  checkpointId: string;
  type: "PHOTO" | "DOCUMENT" | "MEASUREMENT";
  fileUrl?: string;
  fileName?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  measurementValue?: number;
  measurementUnit?: string;
  notes?: string;
  createdAt: string;
  signedUrl?: string;
  uploadedBy?: { id: string; name: string; email: string; role: string };
}

export default function StagesDashboard({
  projectId,
  stages,
  currentUserRole,
  isAuthenticated,
  project,
}: {
  projectId: string;
  stages: StageWithDetails[];
  currentUserRole: string;
  isAuthenticated: boolean;
  project: any;
}) {
  const router = useRouter();
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null);
  const [selectedStage, setSelectedStage] = useState<StageWithDetails | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "evidence">("details");

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<EvidenceItem | null>(null);

  const isEpc = currentUserRole === "EPC_ENGINEER";
  const isInspector = currentUserRole === "INSPECTOR";
  const isOwner = currentUserRole === "OWNER";

  useEffect(() => {
    if (stages.length > 0) {
      const activeStage = stages.find((s) => s.status === "IN_PROGRESS") || stages[0];
      setExpandedStages({ [activeStage.id]: true });
      if (activeStage.checkpoints.length > 0) {
        setSelectedCheckpoint(activeStage.checkpoints[0]);
        setSelectedStage(activeStage);
      }
    }
  }, [stages.length]);

  useEffect(() => {
    if (selectedCheckpoint) {
      loadEvidence(selectedCheckpoint.id);
    }
  }, [selectedCheckpoint?.id]);

  async function loadEvidence(checkpointId: string) {
    setEvidenceLoading(true);
    try {
      const list = await getEvidence(checkpointId);
      const enriched = await Promise.all(
        list.map(async (item: any) => {
          if (item.type === "PHOTO" || item.type === "DOCUMENT") {
            const detail = await getEvidenceDetail(item.id);
            return detail ? { ...item, signedUrl: detail.signedUrl } : item;
          }
          return item;
        })
      );
      setEvidenceList(enriched);
    } catch {
      setEvidenceList([]);
    } finally {
      setEvidenceLoading(false);
    }
  }

  const toggleExpand = (stageId: string) => {
    setExpandedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const handleRowClick = (cp: Checkpoint, stage: StageWithDetails) => {
    setSelectedCheckpoint(cp);
    setSelectedStage(stage);
    setActiveTab("details");
  };

  const handleResultChange = (
    checkpointId: string,
    stageId: string,
    result: CheckpointResult
  ) => {
    setPendingId(checkpointId);
    setError(null);
    startTransition(async () => {
      const res = await updateCheckpointResult(projectId, stageId, checkpointId, result);
      if (res.error) setError(res.error);
      setPendingId(null);
      if (selectedCheckpoint?.id === checkpointId) {
        setSelectedCheckpoint((prev) => (prev ? { ...prev, result } : null));
      }
      router.refresh();
    });
  };

  const handleUpload = async (checkpointId: string, stageId: string, file: File) => {
    setUploadingId(checkpointId);
    setError(null);
    try {
      const mimeType = file.type || (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg");
      const presign = await getPresignedUrl(file.name, mimeType);
      const uploadRes = await fetch(presign.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": mimeType },
      });
      if (!uploadRes.ok) throw new Error("Failed to upload file to storage");
      const type = mimeType.startsWith("image/") ? "PHOTO" : "DOCUMENT";
      const res = await createEvidence(projectId, stageId, checkpointId, {
        type,
        fileUrl: presign.fileUrl,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: mimeType,
      });
      if (res.error) throw new Error(res.error);
      await loadEvidence(checkpointId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const totalCheckpoints = stages.reduce((acc, s) => acc + s.checkpoints.length, 0);
  const passedCheckpoints = stages.reduce(
    (acc, s) => acc + s.checkpoints.filter((cp) => cp.result === "PASS").length,
    0
  );
  const progressPercent =
    totalCheckpoints > 0 ? Math.round((passedCheckpoints / totalCheckpoints) * 100) : 0;

  const allCheckpoints = stages.flatMap((s) =>
    s.checkpoints.map((cp) => ({ cp, stage: s }))
  );
  const currentIdx = allCheckpoints.findIndex((x) => x.cp.id === selectedCheckpoint?.id);

  const goToPrev = () => {
    if (currentIdx > 0) {
      const prev = allCheckpoints[currentIdx - 1];
      setSelectedCheckpoint(prev.cp);
      setSelectedStage(prev.stage);
      setActiveTab("details");
    }
  };
  const goToNext = () => {
    if (currentIdx < allCheckpoints.length - 1) {
      const next = allCheckpoints[currentIdx + 1];
      setSelectedCheckpoint(next.cp);
      setSelectedStage(next.stage);
      setActiveTab("details");
    }
  };

  const getCheckpointBadge = (result: CheckpointResult) => {
    switch (result) {
      case "PASS":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </span>
        );
      case "FAIL":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            <XCircle className="h-3 w-3" /> Failed
          </span>
        );
      case "NA":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            N/A
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  const getStageIcon = (status: string, passed: number, total: number) => {
    if (status === "APPROVED" || (total > 0 && passed === total)) {
      return (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </div>
      );
    }
    if (status === "IN_PROGRESS" || passed > 0) {
      return (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      );
    }
    return (
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
      </div>
    );
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="relative w-full">
      {/* ============ LEFT / MAIN CONTENT ============ */}
      <div className="w-full space-y-3">


        {/* Overall Progress bar */}
        <div className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-600 shrink-0">Overall Progress</span>
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-800 shrink-0">{progressPercent}%</span>
          <span className="text-xs text-slate-400 shrink-0">
            {passedCheckpoints} / {totalCheckpoints} checkpoints complete
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Stage Accordions */}
        <div className="space-y-2">
          {stages.map((stage) => {
            const isExpanded = !!expandedStages[stage.id];
            const stageTotal = stage.checkpoints.length;
            const stagePassed = stage.checkpoints.filter((cp) => cp.result === "PASS").length;
            const stageProgress =
              stageTotal > 0 ? Math.round((stagePassed / stageTotal) * 100) : 0;

            return (
              <div
                key={stage.id}
                className={`rounded-xl border bg-white overflow-hidden ${
                  isExpanded ? "border-slate-200 shadow-sm" : "border-slate-200"
                }`}
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleExpand(stage.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50/60 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getStageIcon(stage.status, stagePassed, stageTotal)}
                    <span className="text-sm text-slate-400 font-semibold shrink-0">
                      Stage {stage.displayOrder}
                    </span>
                    <span className="text-base font-extrabold text-slate-800 font-heading truncate">
                      {stage.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    {/* Inline progress */}
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all"
                          style={{ width: `${stageProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">
                        {stageProgress}%
                      </span>
                    </div>
                    <span className="text-sm text-slate-400 font-semibold">
                      {stagePassed} / {stageTotal}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Body */}
                {isExpanded && (
                  <div className="border-t border-slate-100">
                    {/* EPC action bar */}
                    {(isEpc || isOwner) && (
                      <div className="flex items-center gap-3 px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex-wrap">
                        {isEpc && (
                          <CreateInspectionRequestModal
                            projectId={projectId}
                            stageId={stage.id}
                          />
                        )}
                        {isEpc && (
                          <CreateCheckpointForm
                            projectId={projectId}
                            stageId={stage.id}
                          />
                        )}
                      </div>
                    )}

                    {stageTotal === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400">
                        No checkpoints in this stage.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="py-2 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Checkpoint
                              </th>
                              <th className="py-2 px-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="py-2 px-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Evidence
                              </th>
                              <th className="py-2 px-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Due Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {stage.checkpoints.map((cp) => {
                              const isSelected = selectedCheckpoint?.id === cp.id;
                              return (
                                <tr
                                  key={cp.id}
                                  onClick={() => handleRowClick(cp, stage)}
                                  className={`border-b border-slate-100 last:border-0 cursor-pointer text-sm transition-colors group ${
                                    isSelected
                                      ? "bg-emerald-50/50 border-l-2 border-l-primary"
                                      : "hover:bg-slate-50/60"
                                  }`}
                                >
                                  <td className="py-2.5 px-4">
                                    <span
                                      className={`font-semibold ${
                                        isSelected ? "text-primary" : "text-slate-700"
                                      }`}
                                    >
                                      {cp.title}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    {getCheckpointBadge(cp.result)}
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <Paperclip className="h-3 w-3" />
                                      <span className="text-xs">0</span>
                                    </div>
                                  </td>
                                  <td className="py-2.5 px-3">
                                    <div className="flex items-center gap-1 text-slate-400">
                                      <Calendar className="h-3 w-3" />
                                      <span className="text-xs">—</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {stages.length === 0 && (
            <div className="py-16 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
              <div className="text-3xl mb-2">📋</div>
              <p className="text-sm font-medium">No stages yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ============ RIGHT PANEL — fixed overlay, does NOT push content ============ */}
      {selectedCheckpoint && (
        <>
          {/* Backdrop on mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setSelectedCheckpoint(null)}
          />

          <aside className="fixed top-16 right-0 bottom-0 z-40 w-[340px] bg-white border-l border-slate-200 shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 font-heading leading-tight flex-1 mr-2 truncate">
                {selectedCheckpoint.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                {getCheckpointBadge(selectedCheckpoint.result)}
                <button
                  onClick={goToPrev}
                  disabled={currentIdx <= 0}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentIdx >= allCheckpoints.length - 1}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setSelectedCheckpoint(null)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Tabs — simple underline style matching the image */}
            <div className="flex border-b border-slate-100 px-4">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`py-2.5 mr-4 text-sm font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeTab === "details"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("evidence")}
                className={`py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeTab === "evidence"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Evidence
                {evidenceList.length > 0 && (
                  <span className="ml-1 text-xs text-slate-400">
                    ({evidenceList.length})
                  </span>
                )}
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto">
               {activeTab === "details" ? (
                <div className="px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Checkpoint Details
                  </p>
                  <div className="divide-y divide-slate-100">
                    <PanelRow label="Stage" value={selectedStage?.name || "—"} />
                    <PanelRow
                      label="Description"
                      value={
                        selectedCheckpoint.description || (
                          <span className="text-slate-400 italic">No description provided.</span>
                        )
                      }
                    />
                    <PanelRow
                      label="Assigned To"
                      value={
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {project?.assignedInspector || "Not assigned"}
                        </span>
                      }
                    />
                    <PanelRow
                      label="Due Date"
                      value={
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          —
                        </span>
                      }
                    />
                    <PanelRow
                      label="Status"
                      value={getCheckpointBadge(selectedCheckpoint.result)}
                    />
                  </div>

                  {/* Inspector: update status */}
                  {isInspector && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Update Status
                      </p>
                      <select
                        value={selectedCheckpoint.result}
                        disabled={pendingId === selectedCheckpoint.id}
                        onChange={(e) => {
                          const stageId =
                            stages.find((s) =>
                              s.checkpoints.some((c) => c.id === selectedCheckpoint.id)
                            )?.id || "";
                          handleResultChange(
                              selectedCheckpoint.id,
                              stageId,
                              e.target.value as CheckpointResult
                          );
                        }}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 cursor-pointer"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PASS">Pass</option>
                        <option value="FAIL">Fail</option>
                        <option value="NA">N/A</option>
                      </select>
                      {pendingId === selectedCheckpoint.id && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                        </div>
                      )}
                    </div>
                  )}

                  {/* EPC: Dispatch inspection */}
                  {isEpc && selectedStage && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <CreateInspectionRequestModal
                        projectId={projectId}
                        stageId={selectedStage.id}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Evidence Tab */
                <div className="px-4 py-4 space-y-3">
                  {/* Add evidence */}
                  {isInspector && (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        disabled={!!uploadingId}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && selectedCheckpoint) {
                            const stageId =
                              stages.find((s) =>
                                s.checkpoints.some((c) => c.id === selectedCheckpoint.id)
                              )?.id || "";
                            handleUpload(selectedCheckpoint.id, stageId, file);
                          }
                          e.target.value = "";
                        }}
                      />
                      <div className="h-9 w-full border border-primary text-primary hover:bg-primary/5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors">
                        {uploadingId ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" /> Add Evidence
                          </>
                        )}
                      </div>
                    </label>
                  )}

                  {evidenceLoading ? (
                    <div className="flex items-center justify-center py-8 gap-2 text-xs text-slate-400">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Loading...
                    </div>
                  ) : evidenceList.length === 0 ? (
                    <div className="py-8 text-center text-sm text-slate-400">
                      No evidence uploaded yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Photos */}
                      {evidenceList.filter((e) => e.type === "PHOTO").length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {evidenceList
                            .filter((e) => e.type === "PHOTO")
                            .map((item) => (
                              <div key={item.id}>
                                <div
                                  onClick={() => item.signedUrl && setLightboxItem(item)}
                                  className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group relative"
                                >
                                  {item.signedUrl ? (
                                    <img
                                      src={item.signedUrl}
                                      alt={item.fileName || "Evidence"}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <ImageIcon className="h-8 w-8 text-slate-300" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <ExternalLink className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 drop-shadow" />
                                  </div>
                                </div>
                                <div className="mt-1 text-[10px] text-slate-500 leading-tight">
                                  <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                                  <div className="font-medium text-slate-600 truncate">
                                    {item.uploadedBy?.name || "—"}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Documents */}
                      {evidenceList
                        .filter((e) => e.type === "DOCUMENT")
                        .map((item) => (
                          <a
                            key={item.id}
                            href={item.signedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:border-primary/30 hover:bg-slate-50 transition-all group"
                          >
                            <div className="h-8 w-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4 text-red-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-slate-700 truncate group-hover:text-primary">
                                {item.fileName || "document.pdf"}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {formatBytes(item.fileSizeBytes)}
                              </div>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-primary shrink-0" />
                          </a>
                        ))}

                      {/* Measurements */}
                      {evidenceList
                        .filter((e) => e.type === "MEASUREMENT")
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50"
                          >
                            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                              <Ruler className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">
                                Measurement
                              </div>
                              <div className="text-sm font-bold text-slate-800">
                                {item.measurementValue} {item.measurementUnit}
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* Notes */}
                      {evidenceList.some((e) => e.notes) && (
                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                            Notes
                          </p>
                          {evidenceList
                            .filter((e) => e.notes)
                            .map((item) => (
                              <p
                                key={item.id}
                                className="text-xs text-slate-600 leading-relaxed"
                              >
                                {item.notes}
                              </p>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Lightbox */}
      {lightboxItem?.signedUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setLightboxItem(null)}
        >
          <div className="absolute top-4 right-4 flex gap-2">
            <a
              href={lightboxItem.signedUrl}
              download={lightboxItem.fileName}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/10 transition-all"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={() => setLightboxItem(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/10 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <img
            src={lightboxItem.signedUrl}
            alt={lightboxItem.fileName || "Evidence"}
            className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center text-white/70 text-xs">
            <div className="font-semibold">{lightboxItem.fileName}</div>
            <div className="text-white/50">
              {lightboxItem.uploadedBy?.name} ·{" "}
              {new Date(lightboxItem.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PanelRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 py-2.5 text-sm">
      <span className="col-span-2 text-slate-400 font-semibold">{label}</span>
      <span className="col-span-3 text-slate-700 font-medium">{value}</span>
    </div>
  );
}
