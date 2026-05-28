import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshTokensViaApi } from "./lib/auth-refresh";
import { applyAuthCookies } from "./lib/auth-cookies";

export async function proxy(request: NextRequest) {
  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const role = request.cookies.get("userRole")?.value;

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/login");
  const isProtected =
    pathname.startsWith("/setup") || pathname.startsWith("/dashboard");
  const isInspectPublic = pathname.startsWith("/inspect");

  // Access cookie expired but refresh token still valid — rotate before routing
  if (!accessToken && refreshToken && isProtected) {
    const tokens = await refreshTokensViaApi(refreshToken);
    if (tokens) {
      accessToken = tokens.accessToken;
      const response = NextResponse.next();
      applyAuthCookies(
        response,
        tokens.accessToken,
        tokens.refreshToken,
        role
      );
      return response;
    }
  }

  if (!accessToken && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && isAuthPage) {
    const destination =
      role === "OWNER" ? "/setup" : "/dashboard/projects";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (accessToken && role !== "OWNER" && pathname.startsWith("/setup")) {
    return NextResponse.redirect(new URL("/dashboard/projects", request.url));
  }

  if (isInspectPublic) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/setup/:path*", "/dashboard/:path*", "/login", "/inspect/:path*"],
};
