"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, FolderKanban, User, LogOut, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  logoutAction: () => Promise<void>;
}

export function Sidebar({ user, logoutAction }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  // Helper to check if a link is active
  const isActive = (href: string) => {
    if (href === "/dashboard/projects") {
      return pathname.startsWith("/dashboard/projects") || pathname === "/dashboard";
    }
    return pathname === href;
  };

  const navLinks = [
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      badge: 3,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ];

  const formatRole = (role: string) => {
    switch (role) {
      case "OWNER":
        return "Owner";
      case "EPC_ENGINEER":
        return "EPC Engineer";
      case "INSPECTOR":
        return "Inspector";
      case "SUPER_ADMIN":
        return "Super Admin";
      default:
        return role;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
      {/* Header / Brand */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="text-base font-bold tracking-tight">
            Inspect<span className="text-primary">Flow</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105 ${
                  active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                }`} />
                {link.name}
              </div>
              {link.badge && !active && (
                <span className="flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white shadow-xs">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile & Logout */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user.email}
              </p>
              <span className="inline-flex mt-1 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {formatRole(user.role)}
              </span>
            </div>
          </div>
        )}

        <form action={logoutAction} className="w-full">
          <Button
            type="submit"
            variant="outline"
            className="w-full justify-center gap-2 text-xs font-bold border-sidebar-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 rounded-xl py-5 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex h-16 items-center justify-between px-6 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-20 w-full">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight">
            Inspect<span className="text-primary">Flow</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 -mr-2 text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer Overlay) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
