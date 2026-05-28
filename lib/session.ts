import { cookies } from "next/headers";

const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value;
}

export async function getUserRole(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("userRole")?.value;
}

export async function setSession(
  accessToken: string,
  refreshToken: string,
  role: string
) {
  const cookieStore = await cookies();
  const accessExpiresAt = new Date(Date.now() + ACCESS_TTL_MS);
  const refreshExpiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: accessExpiresAt,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: refreshExpiresAt,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("userRole", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: refreshExpiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  cookieStore.delete("userRole");
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  if (token) return true;
  const refresh = await getRefreshToken();
  return !!refresh;
}
