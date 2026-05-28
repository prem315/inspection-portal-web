import {
  getRefreshToken,
  getUserRole,
  setSession,
  clearSession,
} from "./session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type RefreshTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function refreshTokensViaApi(
  refreshToken: string
): Promise<RefreshTokens | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data?.accessToken || !data?.refreshToken) {
      return null;
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  } catch {
    return null;
  }
}

/**
 * Rotate tokens using the httpOnly refresh cookie and persist new cookies.
 * Returns the new access token, or null if refresh failed.
 */
export async function tryRefreshSession(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const tokens = await refreshTokensViaApi(refreshToken);
  if (!tokens) {
    return null;
  }

  const role = (await getUserRole()) ?? "EPC_ENGINEER";
  await setSession(tokens.accessToken, tokens.refreshToken, role);
  return tokens.accessToken;
}

export async function clearSessionAndRedirectToLogin(): Promise<void> {
  await clearSession();
  const { redirect } = await import("next/navigation");
  redirect("/login");
}
