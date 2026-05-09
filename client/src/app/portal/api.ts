import type { PortalRole } from "../content/portal";

export type PortalUser = {
  id?: string;
  role: PortalRole;
  name: string;
  email: string;
};

export type PortalSession = {
  token: string;
  user: PortalUser;
};

const STORAGE_KEY = "success-academy-portal-session";

export function getStoredPortalSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PortalSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function savePortalSession(session: PortalSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearPortalSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = (await response.json()) as {
    ok: boolean;
    message?: string;
    data?: T;
  };

  if (!response.ok || !payload.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload.data as T;
}
