import { getCurrentProfile } from "@/app/actions/profile";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";

export const metadata = {
  title: "Profile Settings | InspectFlow",
};

export default async function ProfilePage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();
  if (!profile) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-semibold">
          Error loading user profile. Please check if the backend service is running and try again.
        </div>
      </div>
    );
  }

  return <ProfileForm initialProfile={profile} />;
}
