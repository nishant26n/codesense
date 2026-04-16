/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("cs_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [usageInfo, setUsageInfo] = useState({ usedToday: 0, dailyLimit: 5 });

  // Verify token and refresh user info on startup
  useEffect(() => {
    const token = localStorage.getItem("cs_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/api/auth/me")
      .then(({ data }) => {
        const u = {
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

  const saveAuth = (token, userData) => {
    localStorage.setItem("cs_token", token);
    localStorage.setItem("cs_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    saveAuth(data.token, data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/api/auth/register", {
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
      const { data } = await api.get("/api/auth/me");
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
