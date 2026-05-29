import { redirect } from "next/navigation";

// The individual stage workbench has been merged into the unified stages dashboard.
// Redirect any direct links to the parent stages page.
export default async function StageDetailRedirectPage({
  params,
}: {
  params: Promise<{ id: string; sid: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/projects/${id}/stages`);
}
