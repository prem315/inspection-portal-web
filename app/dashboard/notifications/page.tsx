"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  Trash2,
  UserPlus,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  ExternalLink,
  BellOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "INVITATION" | "INSPECTION" | "APPROVAL" | "CHECKPOINT" | "EVIDENCE";
  createdAt: string;
  isRead: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "New EPC Member Registered",
    description: "EPC Engineer engineer@example.com accepted your invitation to join Solar Array North.",
    type: "INVITATION",
    createdAt: "5 minutes ago",
    isRead: false,
    link: "/dashboard/projects",
  },
  {
    id: "2",
    title: "Inspection Requested",
    description: "A new inspection request was submitted for Stage 2 (Foundation Concrete Check) on Windfarm East.",
    type: "INSPECTION",
    createdAt: "1 hour ago",
    isRead: false,
    link: "/dashboard/projects",
  },
  {
    id: "3",
    title: "Critical Checkpoint Failed",
    description: "Checkpoint 'Anchor Bolt Torque Verification' in Stage 1 was marked as FAILED by Inspector Jane Smith.",
    type: "CHECKPOINT",
    createdAt: "2 hours ago",
    isRead: false,
    link: "/dashboard/projects",
  },
  {
    id: "4",
    title: "Evidence Uploaded",
    description: "Site photos for checklist completion were uploaded by EPC Engineer for Project Hydro Power Station.",
    type: "EVIDENCE",
    createdAt: "Yesterday",
    isRead: true,
    link: "/dashboard/projects",
  },
  {
    id: "5",
    title: "Stage Approved",
    description: "Stage 1 (Excavation & Shoring) has been approved by Owner for Industrial Warehouse Depot.",
    type: "APPROVAL",
    createdAt: "3 days ago",
    isRead: true,
    link: "/dashboard/projects",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "INVITATION":
        return UserPlus;
      case "INSPECTION":
        return FileText;
      case "APPROVAL":
        return CheckCircle2;
      case "CHECKPOINT":
        return AlertTriangle;
      case "EVIDENCE":
        return FileUp;
      default:
        return Bell;
    }
  };

  const getIconStyle = (type: string, isRead: boolean) => {
    const base = "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ";
    if (!isRead) {
      switch (type) {
        case "INVITATION":
          return base + "bg-blue-50 text-blue-700 border-blue-200/50";
        case "INSPECTION":
          return base + "bg-indigo-50 text-indigo-700 border-indigo-200/50";
        case "APPROVAL":
          return base + "bg-emerald-50 text-emerald-700 border-emerald-200/50";
        case "CHECKPOINT":
          return base + "bg-red-50 text-red-700 border-red-200/50";
        case "EVIDENCE":
          return base + "bg-cyan-50 text-cyan-700 border-cyan-200/50";
        default:
          return base + "bg-primary/10 text-primary border-primary/20";
      }
    }
    return base + "bg-muted text-muted-foreground border-border/50";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary">
              <Bell className="h-3 w-3" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Updates
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            Notification Center
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Stay updated with stage approvals, checklist tasks, and inspection requests.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs font-semibold rounded-xl border-border hover:bg-muted cursor-pointer"
            >
              Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-xs font-semibold rounded-xl border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 cursor-pointer"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all relative ${
            filter === "all"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          All Notifications
          {notifications.length > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
              {notifications.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all relative ${
            filter === "unread"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* List */}
      {filteredNotifications.length === 0 ? (
        <Card className="border-border bg-white shadow-sm rounded-2xl py-12 text-center">
          <CardContent className="space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground/50 mx-auto">
              <BellOff className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">All caught up!</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                No notifications to display in this view.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const Icon = getNotificationIcon(notif.type);
            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border bg-white flex items-start gap-4 transition-all duration-200 group ${
                  notif.isRead
                    ? "border-border/60 opacity-80"
                    : "border-border shadow-sm hover:border-primary/20"
                }`}
              >
                {/* Icon */}
                <div className={getIconStyle(notif.type, notif.isRead)}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className={`text-sm font-bold truncate ${notif.isRead ? "text-foreground/80" : "text-foreground"}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {notif.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-muted/30 mt-3">
                    <div className="flex items-center gap-3">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Mark read
                        </button>
                      )}
                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View details
                        </Link>
                      )}
                    </div>

                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-muted-foreground/60 hover:text-destructive p-1 rounded-lg hover:bg-destructive/5 transition-colors cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
