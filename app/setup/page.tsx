import type { Metadata } from "next";
import { redirect } from "next/navigation";
import OwnerSetupWizard from "./_components/OwnerSetupWizard";
import { getUserRole, isAuthenticated } from "@/lib/session";
import { getTemplates } from "@/app/actions/templates";

export const metadata: Metadata = {
  title: "Workspace Setup | InspectFlow",
  description: "Create a project, invite the EPC engineer, and customize stages.",
};

export default async function SetupPage() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }

  const role = await getUserRole();
  if (role !== "OWNER") {
    redirect("/dashboard");
  }

  const templates = await getTemplates();

  return <OwnerSetupWizard initialTemplates={templates} />;
}
