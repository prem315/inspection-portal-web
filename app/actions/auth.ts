"use server";

import { redirect } from "next/navigation";
import { setSession, clearSession, getAccessToken } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(
  _state: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portal: "WEB_APP" }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "Invalid email or password." };
      }
      const data = await response.json().catch(() => null);
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message;
      return { error: message || "Something went wrong. Please try again." };
    }

    const data = await response.json();
    await setSession(data.accessToken, data.refreshToken, data.user.role);

    const next = formData.get("next") as string | null;
    if (next && next.startsWith("/")) {
      redirect(next);
    }

    if (data.user.role === "OWNER") {
      redirect("/setup");
    }

    redirect("/dashboard/projects");
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "NEXT_REDIRECT" ||
        (error as { digest?: string }).digest?.startsWith("NEXT_REDIRECT"))
    ) {
      throw error;
    }
    return { error: "Unable to connect to the server. Please check your connection." };
  }
}

export async function logout() {
  const token = await getAccessToken();

  if (token) {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/logout`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch {
      // Continue with local session cleanup
    }
  }

  await clearSession();
  redirect("/login");
}
