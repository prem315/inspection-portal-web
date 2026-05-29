"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    { name: "Stages", href: `${base}/stages` },
    { name: "Overview", href: base },
    { name: "Team", href: `${base}/team` },
    { name: "Documents", href: `${base}/documents` },
    { name: "Reports", href: `${base}/reports` },
    ...(userRole === "OWNER" ? [{ name: "Settings", href: `${base}/settings` }] : []),
  ];

  return (
    <nav className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
      {links.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== base && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
              isActive
                ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
