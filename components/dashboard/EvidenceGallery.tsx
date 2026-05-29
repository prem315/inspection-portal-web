"use client";

import { useEffect, useState } from "react";
import { getEvidence, getEvidenceDetail } from "@/app/actions/evidence";
import {
  FileText,
  Image as ImageIcon,
  Ruler,
  User,
  Calendar,
  ExternalLink,
  X,
  Download,
  Loader2,
  FileCheck2,
} from "lucide-react";

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
  uploadedBy?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function EvidenceGallery({
  checkpointId,
  refreshTrigger,
}: {
  checkpointId: string;
  refreshTrigger?: any;
}) {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxItem, setLightboxItem] = useState<EvidenceItem | null>(null);

  useEffect(() => {
    async function loadEvidence() {
      setLoading(true);
      try {
        const list = await getEvidence(checkpointId);
        // Enrich files with temporary S3 signed URLs
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
      } catch (error) {
        console.error("Failed to load evidence details:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvidence();
  }, [checkpointId, refreshTrigger]);

  const formatBytes = (bytes?: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Loading verification evidence...</span>
      </div>
    );
  }

  if (evidenceList.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-3 border-t border-border/40 space-y-2.5">
      <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <FileCheck2 className="h-3.5 w-3.5 text-primary" />
        Verification Evidence ({evidenceList.length})
      </h5>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {evidenceList.map((item) => {
          const uploaderName = item.uploadedBy?.name || "Unknown Inspector";
          const uploadDate = new Date(item.createdAt).toLocaleString();

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between p-3.5 rounded-xl border border-border bg-muted/10 hover:bg-white hover:shadow-sm transition-all text-xs"
            >
              {/* Type Specific Rendering */}
              <div className="space-y-2.5">
                {item.type === "PHOTO" && item.signedUrl && (
                  <div
                    onClick={() => setLightboxItem(item)}
                    className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border cursor-pointer group shadow-inner"
                  >
                    <img
                      src={item.signedUrl}
                      alt={item.fileName || "Evidence Image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ExternalLink className="h-5 w-5 text-white drop-shadow" />
                    </div>
                  </div>
                )}

                {item.type === "DOCUMENT" && (
                  <a
                    href={item.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-white hover:border-primary/30 transition-colors group cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 shadow-sm">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {item.fileName || "document.pdf"}
                      </div>
                      {item.fileSizeBytes && (
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {formatBytes(item.fileSizeBytes)}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                  </a>
                )}

                {item.type === "MEASUREMENT" && (
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border bg-white shadow-sm">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                      <Ruler className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide leading-tight">
                        Recorded Metric
                      </div>
                      <div className="text-sm font-extrabold text-foreground font-heading mt-0.5">
                        {item.measurementValue} {item.measurementUnit}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <p className="text-[11px] text-foreground leading-relaxed italic bg-white/60 p-2 rounded-lg border border-border/40">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Uploader Meta Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-border/40 space-y-1 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-primary/75" />
                  <span className="font-semibold text-slate-700">{uploaderName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{uploadDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxItem && lightboxItem.signedUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-200">
          {/* Top Panel Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <a
              href={lightboxItem.signedUrl}
              download={lightboxItem.fileName || "evidence-file"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all shadow cursor-pointer"
              title="Download Original"
            >
              <Download className="h-4.5 w-4.5" />
            </a>
            <button
              onClick={() => setLightboxItem(null)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md transition-all shadow cursor-pointer"
              title="Close"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="flex flex-col items-center max-w-4xl w-full max-h-[85vh] p-2 space-y-4">
            <img
              src={lightboxItem.signedUrl}
              alt={lightboxItem.fileName || "Evidence Lightbox"}
              className="max-w-full max-h-[70vh] object-contain rounded-xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
            />
            
            <div className="text-center text-white space-y-1.5 max-w-lg">
              <h4 className="text-sm font-bold truncate">{lightboxItem.fileName}</h4>
              {lightboxItem.notes && (
                <p className="text-xs text-white/80 italic font-sans">&ldquo;{lightboxItem.notes}&rdquo;</p>
              )}
              <div className="flex justify-center gap-4 text-[10px] text-white/60 pt-1">
                <span>By: {lightboxItem.uploadedBy?.name}</span>
                <span>Date: {new Date(lightboxItem.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
