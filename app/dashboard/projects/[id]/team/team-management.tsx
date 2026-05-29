"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  UserPlus,
  Trash2,
  Loader2,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Shield,
  RefreshCw,
} from "lucide-react";
import {
  inviteMember,
  cancelInvitation,
  getProjectInvitations,
  type Invitation,
} from "@/app/actions/invitations";
import { getProjectAssignments, getProject } from "@/app/actions/projects";

interface TeamManagementProps {
  projectId: string;
  currentUserRole: string;
  initialAssignments: any[];
  initialInvitations: Invitation[];
}

export default function TeamManagement({
  projectId,
  currentUserRole,
  initialAssignments,
  initialInvitations,
}: TeamManagementProps) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [isInviting, setIsInviting] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [isRefreshing, startRefresh] = useTransition();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatDate = (dateStr: string) => {
    if (!isMounted) return "...";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return "...";
    }
  };

  const isOwner = currentUserRole === "OWNER" || currentUserRole === "SUPER_ADMIN";

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    setIsInviting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const role = formData.get("role") as "EPC_ENGINEER" | "INSPECTOR";

    try {
      const res = await inviteMember(projectId, email, role);
      if (res.success) {
        setInviteSuccess(`Invitation sent successfully to ${email}`);
        e.currentTarget.reset();
        // Refresh invitations list
        const updated = await getProjectInvitations(projectId);
        setInvitations(updated);
      } else {
        setInviteError(res.error || "Failed to send invitation.");
      }
    } catch (err) {
      setInviteError("An unexpected error occurred.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleRevoke = async (invitationId: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke the invitation for ${email}?`)) {
      return;
    }
    setRevokingId(invitationId);
    try {
      const res = await cancelInvitation(invitationId, projectId);
      if (res.success) {
        // Refresh invitations list
        const updated = await getProjectInvitations(projectId);
        setInvitations(updated);
      } else {
        alert(res.error || "Failed to revoke invitation.");
      }
    } catch (err) {
      alert("An unexpected error occurred.");
    } finally {
      setRevokingId(null);
    }
  };

  const handleRefresh = () => {
    startRefresh(async () => {
      try {
        if (isOwner) {
          const [updatedAssigns, updatedInvites] = await Promise.all([
            getProjectAssignments(projectId),
            getProjectInvitations(projectId),
          ]);
          setAssignments(updatedAssigns);
          setInvitations(updatedInvites);
        } else {
          const proj = await getProject(projectId);
          if (proj?.assignments) {
            setAssignments(proj.assignments);
          }
        }
      } catch (err) {
        console.error("Failed to refresh team roster:", err);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Header Controls */}
      <div className="flex justify-end">
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
          className="text-sm flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh lists"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Active Assignments */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-slate-50/50">
              <UserCheck className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Active Team Members ({assignments.length})</h2>
            </div>

            {assignments.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No team members assigned to this project yet.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {assignments.map((assignment: any) => {
                  const user = assignment.user || {};
                  const name = user.name || `User (${assignment.userId.substring(0, 8)})`;
                  const email = user.email || "No email provided";
                  const roleLabel = assignment.assignedRole === "EPC_ENGINEER" ? "EPC Engineer" : "Inspector";

                  return (
                    <li key={assignment.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                        <p className="text-sm text-muted-foreground truncate">{email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Assigned on {formatDate(assignment.createdAt || assignment.assignedAt)}
                        </p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground shrink-0 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {roleLabel}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Invite & Pending Invitations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Invite Form */}
          {isOwner && (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">Invite to Project</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Send an invitation email to add an engineer or inspector to this project.
              </p>

              <form onSubmit={handleInvite} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="engineer@company.com"
                    className="w-full h-10 px-3 border border-input rounded-lg text-sm bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="role" className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    Project Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="w-full h-10 px-3 border border-input rounded-lg text-sm bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="EPC_ENGINEER">EPC Engineer</option>
                    <option value="INSPECTOR">Inspector</option>
                  </select>
                </div>

                {inviteError && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200/60 text-red-800 text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{inviteError}</span>
                  </div>
                )}

                {inviteSuccess && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-200/60 text-green-800 text-sm">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{inviteSuccess}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isInviting}
                  className="w-full bg-primary text-white hover:bg-primary/95 text-sm font-bold h-10 rounded-lg shadow-sm"
                >
                  {isInviting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Sending Invitation...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Pending Invitations List */}
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-2 bg-slate-50/50">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">Pending Invites ({invitations.length})</h2>
            </div>

            {invitations.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No pending invitations.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {invitations.map((invite) => {
                  const roleLabel = invite.role === "EPC_ENGINEER" ? "EPC Engineer" : "Inspector";
                  const isRevoking = revokingId === invite.id;
                  const isExpired = new Date(invite.expiresAt) < new Date();

                  return (
                    <li key={invite.id} className="px-6 py-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{invite.email}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {roleLabel}
                          </span>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                            isExpired ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
                          }`}>
                            {isExpired ? "EXPIRED" : invite.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Expires: {formatDate(invite.expiresAt)}
                        </p>
                      </div>

                      {isOwner && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isRevoking}
                          onClick={() => handleRevoke(invite.id, invite.email)}
                          className="text-muted-foreground hover:text-red-600 hover:bg-red-50 h-8 w-8 shrink-0"
                          title="Revoke invitation"
                        >
                          {isRevoking ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
