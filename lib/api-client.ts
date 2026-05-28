import { getAccessToken } from "./session";
import { tryRefreshSession, clearSessionAndRedirectToLogin } from "./auth-refresh";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatApiError(
  errorData: { message?: string | string[]; error?: string } | null,
  status: number
) {
  if (!errorData) {
    return `API Error: ${status}`;
  }
  const { message, error } = errorData;
  if (Array.isArray(message)) {
    return message.join(", ");
  }
  return message || error || `API Error: ${status}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchApi(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<any> {
  const token = await getAccessToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  if (response.status === 401 && !isRetry) {
    const newAccessToken = await tryRefreshSession();
    if (newAccessToken) {
      return fetchApi(endpoint, options, true);
    }
    await clearSessionAndRedirectToLogin();
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorData: { message?: string | string[]; error?: string } | null = null;
    if (contentType?.includes("application/json")) {
      errorData = await response.json().catch(() => null);
    }

    throw new Error(formatApiError(errorData, response.status));
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
