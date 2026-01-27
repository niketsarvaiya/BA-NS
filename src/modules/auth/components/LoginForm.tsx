"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthShell, FieldShell } from "./AuthShell";

const MESSAGES = [
  "Aligning tasks…",
  "Syncing project flow…",
  "Loading your workspace…",
];

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!submitting) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    let index = 0;

    intervalRef.current = window.setInterval(() => {
      setStatusMessage(MESSAGES[index]);
      index = (index + 1) % MESSAGES.length;
    }, 2500);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [submitting]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(username, password);
      const raw = window.localStorage.getItem("beyond-assist-auth");
      const parsed = raw ? JSON.parse(raw) : null;
      const mustChange = parsed?.user?.mustChangePassword;

      if (mustChange) {
        router.replace("/auth/first-login");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials.";
      setError(message);
      setSubmitting(false);
    }
  }

  return (
    <AuthShell statusMessage={statusMessage}>
      <CardContent className="p-0">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <Alert
              variant="destructive"
              className="border-red-500/40 bg-red-950/40"
            >
              <AlertDescription className="text-xs text-red-100">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <FieldShell label="Username">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11 rounded-xl border-slate-700/70 bg-slate-900/70 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-sky-500/60 focus-visible:ring-2 focus-visible:ring-sky-500/60"
              />
            </div>
          </FieldShell>

          <FieldShell label="Password">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-slate-700/70 bg-slate-900/70 pl-9 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-sky-500/60 focus-visible:ring-2 focus-visible:ring-sky-500/60"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FieldShell>

          <Button
            type="submit"
            className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-sm font-medium text-slate-50 shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:from-sky-400 hover:to-indigo-400 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-70"
            disabled={submitting}
          >
            {submitting && (
              <Loader2 className="h-4 w-4 animate-spin text-slate-50" />
            )}
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </AuthShell>
  );
};
