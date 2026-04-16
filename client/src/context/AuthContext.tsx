/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useMe, QUERY_KEYS } from "../api/queries";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  register: (name: string, email: string, password: string) => Promise<unknown>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [hasToken, setHasToken] = useState(() => !!localStorage.getItem("cs_token"));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("cs_user");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  // React Query handles deduplication — no double-call in StrictMode
  const { data: meData, isPending: mePending, isError: meIsError } = useMe(hasToken);

  const loading = hasToken ? mePending : false;

  useEffect(() => {
    if (!hasToken || mePending) return;

    if (meData) {
      const u: User = { id: meData.id, name: meData.name, email: meData.email, tier: meData.tier };
      setUser(u);
      localStorage.setItem("cs_user", JSON.stringify(u));
    } else if (meIsError) {
      localStorage.removeItem("cs_token");
      localStorage.removeItem("cs_user");
      setUser(null);
      setHasToken(false);
    }
  }, [meData, mePending, meIsError, hasToken]);

  const saveAuth = (token: string, userData: User) => {
    localStorage.setItem("cs_token", token);
    localStorage.setItem("cs_user", JSON.stringify(userData));
    setUser(userData);
    setHasToken(true);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>("/api/auth/login", { email, password });
    saveAuth(data.token, data.user);
    return data;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>("/api/auth/register", {
      name,
      email,
      password,
    });
    saveAuth(data.token, data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cs_token");
    localStorage.removeItem("cs_user");
    setUser(null);
    setHasToken(false);
    queryClient.removeQueries({ queryKey: QUERY_KEYS.currentUser });
    queryClient.removeQueries({ queryKey: QUERY_KEYS.reviewHistory });
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
