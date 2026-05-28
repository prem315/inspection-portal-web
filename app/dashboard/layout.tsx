import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/lib/session";
import { logout } from "@/app/actions/auth";
import { getCurrentProfile } from "@/app/actions/profile";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export const metadata: Metadata = {
  title: "Dashboard | InspectFlow",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();
  const role = await getUserRole();
  
  const user = profile
    ? { name: profile.name, email: profile.email, role: profile.role }
    : { name: "User", email: "", role: role || "" };

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col md:flex-row">
      <Sidebar user={user} logoutAction={logout} />
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <DashboardHeader user={user} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

