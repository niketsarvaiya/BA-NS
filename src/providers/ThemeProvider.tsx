"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Beyond theme identifiers
// - "calm"  → Beyond Calm (default, existing light design system)
// - "neo"   → Beyond Neo (futuristic dark mode layered on top of existing system)
export type ThemeId = "calm" | "neo";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY_BASE = "beyond-assist-theme-v1";
const AUTH_STORAGE_KEY = "beyond-assist-auth";

function readActiveUserIdFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { user?: { id?: string } };
    const userId = parsed?.user?.id;
    return typeof userId === "string" ? userId : null;
  } catch {
    return null;
  }
}

function getStorageKeyForActiveUser(): string {
  const userId = readActiveUserIdFromStorage();
  return userId ? `${STORAGE_KEY_BASE}:${userId}` : STORAGE_KEY_BASE;
}

function readInitialTheme(): ThemeId {
  if (typeof window === "undefined") return "calm";

  try {
    const storageKey = getStorageKeyForActiveUser();
    const stored = window.localStorage.getItem(storageKey) as ThemeId | null;
    if (stored === "neo" || stored === "calm") {
      return stored;
    }
  } catch {
    // ignore and fall back to Calm
  }

  return "calm";
}

function persistTheme(theme: ThemeId) {
  if (typeof window === "undefined") return;
  try {
    const storageKey = getStorageKeyForActiveUser();
    window.localStorage.setItem(storageKey, theme);
  } catch {
    // ignore storage errors; theme still applies in-session
  }
}

function applyThemeToDocument(theme: ThemeId) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Reset core theme classes first
  root.classList.remove("dark", "theme-neo", "theme-calm");

  if (theme === "neo") {
    // Beyond Neo → dark, layered, premium
    root.classList.add("dark", "theme-neo");
    root.style.setProperty("color-scheme", "dark");
  } else {
    // Beyond Calm → existing light system
    root.classList.add("theme-calm");
    root.style.setProperty("color-scheme", "light");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readInitialTheme);

  // Apply theme whenever it changes
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = (next: ThemeId) => {
    setThemeState((current) => {
      const value = next ?? current;
      persistTheme(value);
      return value;
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "calm" ? "neo" : "calm");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
