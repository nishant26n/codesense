/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import api from "../api/axios";
import type { User, UsageInfo } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  usageInfo: UsageInfo;
  setUsageInfo: Dispatch<SetStateAction<UsageInfo>>;
  login: (email: string, password: string) => Promise<unknown>;
  register: (name: string, email: string, password: string) => Promise<unknown>;
  logout: () => void;
  refreshUsage: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("cs_user");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [usageInfo, setUsageInfo] = useState<UsageInfo>({ usedToday: 0, dailyLimit: 5 });

  // Verify token and refresh user info on startup
  useEffect(() => {
    const token = localStorage.getItem("cs_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get<{ id: number; name: string; email: string; tier: 'free' | 'pro'; usedToday: number; dailyLimit: number }>("/api/auth/me")
      .then(({ data }) => {
        const u: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          tier: data.tier,
        };
        setUser(u);
        setUsageInfo({
          usedToday: data.usedToday,
          dailyLimit: data.dailyLimit,
        });
        localStorage.setItem("cs_user", JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem("cs_token");
        localStorage.removeItem("cs_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveAuth = (token: string, userData: User) => {
    localStorage.setItem("cs_token", token);
    localStorage.setItem("cs_user", JSON.stringify(userData));
    setUser(userData);
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
    setUsageInfo({ usedToday: 0, dailyLimit: 5 });
  }, []);

  const refreshUsage = useCallback(async () => {
    try {
      const { data } = await api.get<{ usedToday: number; dailyLimit: number }>("/api/auth/me");
      setUsageInfo({ usedToday: data.usedToday, dailyLimit: data.dailyLimit });
    } catch {
      // silent
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        usageInfo,
        setUsageInfo,
        login,
        register,
        logout,
        refreshUsage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
