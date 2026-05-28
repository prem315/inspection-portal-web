"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, Users, Sliders, Settings } from "lucide-react";

export default function ProjectNav({
  projectId,
  stageId,
  userRole,
}: {
  projectId: string;
  stageId?: string;
  userRole?: string;
}) {
  const pathname = usePathname();
  const base = `/dashboard/projects/${projectId}`;

  const links = [
    { name: "Overview", href: base, icon: LayoutDashboard },
    { name: "Stages", href: `${base}/stages`, icon: Layers },
    { name: "Team", href: `${base}/team`, icon: Users },
    ...(stageId
      ? [{ name: "Stage workbench", href: `${base}/stages/${stageId}`, icon: Sliders }]
      : []),
    ...(userRole === "OWNER"
      ? [{ name: "Settings", href: `${base}/settings`, icon: Settings }]
      : []),
  ];

  return (
    <nav className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-lg border border-border w-fit">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== base && pathname.startsWith(link.href));
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
