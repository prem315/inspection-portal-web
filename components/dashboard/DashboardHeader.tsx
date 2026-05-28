"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Search, Bell, User } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();

  // Parse path segments to generate beautiful breadcrumbs
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Base "Dashboard"
    breadcrumbs.push({ name: "Dashboard", href: "/dashboard" });

    let currentHref = "/dashboard";
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      currentHref += `/${segment}`;

      if (uuidRegex.test(segment)) {
        breadcrumbs.push({ name: "Project Detail", href: currentHref });
      } else {
        // Capitalize and format segment names
        const formattedName = segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
        breadcrumbs.push({ name: formattedName, href: currentHref });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-10 w-full">
      {/* Left: Dynamic Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.href}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/45" />}
              {isLast ? (
                <span className="text-foreground font-bold tracking-tight">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-primary transition-colors duration-150"
                >
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right: Mock Search & Notification Bell & Profile Avatar */}
      <div className="flex items-center gap-6">
        {/* Mock Search input */}
        <div className="relative w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/80 group-hover:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search workbench..."
            className="w-full h-8.5 pl-9 pr-8 text-xs bg-muted/40 hover:bg-muted/70 focus:bg-background border border-border/80 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all duration-200 outline-hidden text-foreground"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded-md border border-border bg-background px-1.5 font-mono text-[9px] font-bold text-muted-foreground/80 pointer-events-none">
            <span>⌘</span>K
          </kbd>
        </div>

        {/* Short-cut icons */}
        <div className="flex items-center gap-2">
          {/* Notification bell linking to center */}
          <Link
            href="/dashboard/notifications"
            className="relative flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-150"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </Link>
        </div>

        {/* User avatar indicator */}
        {user && (
          <div className="flex items-center gap-2.5 pl-1.5 border-l border-border/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-none text-foreground truncate max-w-[100px]">
                {user.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
