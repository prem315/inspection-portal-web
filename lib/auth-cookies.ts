import type { NextResponse } from "next/server";

const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires,
    sameSite: "lax" as const,
    path: "/",
  };
}

/** Apply rotated auth cookies to a NextResponse (proxy / middleware). */
export function applyAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  role?: string
) {
  response.cookies.set(
    "accessToken",
    accessToken,
    cookieOptions(new Date(Date.now() + ACCESS_TTL_MS))
  );
  response.cookies.set(
    "refreshToken",
    refreshToken,
    cookieOptions(new Date(Date.now() + REFRESH_TTL_MS))
  );
  if (role) {
    response.cookies.set(
      "userRole",
      role,
      cookieOptions(new Date(Date.now() + REFRESH_TTL_MS))
    );
  }
}
