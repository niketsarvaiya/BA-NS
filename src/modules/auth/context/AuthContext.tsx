"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { AuthResponse, AuthUser } from "../types";
import * as authApi from "../api/authClient";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "beyond-assist-auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthResponse;
        setUser(parsed.user);
        setAccessToken(parsed.accessToken);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const persistAuth = useCallback((data: AuthResponse | null) => {
    if (typeof window === "undefined") return;
    if (data) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      const response = await authApi.login({ username, password });
      setUser(response.user);
      setAccessToken(response.accessToken);
      persistAuth(response);
    },
    [persistAuth]
  );

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    persistAuth(null);
  }, [persistAuth]);

  const value: AuthContextValue = {
    user,
    accessToken,
    loading,
    login: handleLogin,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
