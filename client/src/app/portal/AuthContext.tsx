import {
  useCallback,
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PortalRole } from "../content/portal";
import {
  apiRequest,
  clearPortalSession,
  getStoredPortalSession,
  savePortalSession,
  type PortalSession,
  type PortalUser,
} from "./api";

type AuthContextValue = {
  user: PortalUser | null;
  token: string | null;
  isReady: boolean;
  login: (role: PortalRole, form: { email: string; password: string }) => Promise<void>;
  activateStudent: (form: {
    admissionNo: string;
    accessPin: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  activateParent: (form: {
    admissionNo: string;
    phone: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<PortalSession | null>(() => getStoredPortalSession());
  const isReady = true;
  const user = session?.user || null;
  const token = session?.token || null;

  const login = useCallback(async (role: PortalRole, form: { email: string; password: string }) => {
    if (!form.email || !form.password) {
      throw new Error("Please enter both email and password.");
    }

    const nextSession = await apiRequest<PortalSession>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        role,
        email: form.email,
        password: form.password,
      }),
    });

    setSession(nextSession);
    savePortalSession(nextSession);
  }, []);

  const activateStudent = useCallback(
    async (form: {
      admissionNo: string;
      accessPin: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      if (!form.admissionNo || !form.accessPin || !form.lastName || !form.email || !form.password) {
        throw new Error("Please complete all activation fields.");
      }

      const nextSession = await apiRequest<PortalSession>("/api/auth/student-activate", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSession(nextSession);
      savePortalSession(nextSession);
    },
    [],
  );

  const activateParent = useCallback(
    async (form: {
      admissionNo: string;
      phone: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      if (!form.admissionNo || !form.phone || !form.lastName || !form.email || !form.password) {
        throw new Error("Please complete all activation fields.");
      }

      const nextSession = await apiRequest<PortalSession>("/api/auth/parent-activate", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSession(nextSession);
      savePortalSession(nextSession);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiRequest("/api/auth/logout", { method: "POST" }, token);
      } catch {
        // ignore logout network issues and clear local session anyway
      }
    }

    setSession(null);
    clearPortalSession();
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isReady,
      login,
      activateStudent,
      activateParent,
      logout,
    }),
    [activateParent, activateStudent, isReady, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function usePortalAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("usePortalAuth must be used within AuthProvider.");
  }

  return context;
}
