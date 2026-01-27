"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { changePassword } from "../api/authClient";
import { validatePassword } from "../utils/passwordValidation";
import { useAuth } from "../context/AuthContext";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthShell, FieldShell } from "./AuthShell";

function getPasswordStrength(value: string): {
  label: "Weak" | "Okay" | "Strong";
  level: 1 | 2 | 3;
} {
  if (!value) return { label: "Weak", level: 1 };

  const { valid } = validatePassword(value);
  const lengthScore = value.length >= 14 ? 2 : value.length >= 10 ? 1 : 0;
  const hasSymbol = /[^A-Za-z0-9]/.test(value);

  const score = (valid ? 1 : 0) + lengthScore + (hasSymbol ? 1 : 0);

  if (score >= 3) return { label: "Strong", level: 3 };
  if (score >= 2) return { label: "Okay", level: 2 };
  return { label: "Weak", level: 1 };
}

export const FirstLoginForm: React.FC = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(() => getPasswordStrength(newPassword), [
    newPassword,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setErrors([]);

    const validation = validatePassword(newPassword);
    const newErrors = [...validation.errors];

    if (newPassword !== confirmPassword) {
      newErrors.push("New password and confirm password must match.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user?.username) {
      setApiError("User context missing. Please sign in again.");
      return;
    }

    setSubmitting(true);
    try {
      await changePassword({
        username: user.username,
        currentPassword,
        newPassword,
      });

      const updatedUser = { ...user, mustChangePassword: false };
      setUser(updatedUser);

      if (typeof window !== "undefined") {
        const raw = window.localStorage.getItem("beyond-assist-auth");
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.user = updatedUser;
          window.localStorage.setItem(
            "beyond-assist-auth",
            JSON.stringify(parsed)
          );
        }
      }

      router.replace("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to change password.";
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const strengthColors: Record<1 | 2 | 3, string> = {
    1: "bg-red-500",
    2: "bg-amber-400",
    3: "bg-emerald-400",
  };

  const strengthBgColors: Record<1 | 2 | 3, string> = {
    1: "bg-red-500/10",
    2: "bg-amber-400/10",
    3: "bg-emerald-400/10",
  };

  return (
    <AuthShell
      title="Secure your account"
      subtitle="Set a strong password before entering your workspace."
    >
      <CardContent className="p-0">
        <form className="space-y-5" onSubmit={handleSubmit}>
          {(apiError || errors.length > 0) && (
            <Alert
              variant="destructive"
              className="border-red-500/40 bg-red-950/40"
            >
              <AlertDescription className="space-y-1 text-xs text-red-100">
                {apiError && <div>{apiError}</div>}
                {errors.map((err) => (
                  <div key={err}>{err}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          <FieldShell label="Current password">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-slate-700/70 bg-slate-900/70 pl-9 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-sky-500/60 focus-visible:ring-2 focus-visible:ring-sky-500/60"
              />
              <button
                type="button"
                aria-label={showCurrent ? "Hide password" : "Show password"}
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-slate-400 hover:text-slate-200"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FieldShell>

          <FieldShell label="New password">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="newPassword"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-slate-700/70 bg-slate-900/70 pl-9 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-sky-500/60 focus-visible:ring-2 focus-visible:ring-sky-500/60"
              />
              <button
                type="button"
                aria-label={showNew ? "Hide password" : "Show password"}
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-slate-400 hover:text-slate-200"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-2 space-y-1.5 text-[11px] text-slate-400">
              <p className="font-medium text-slate-300">Password must include:</p>
              <ul className="list-disc space-y-0.5 pl-4">
                <li>At least 10 characters</li>
                <li>At least 1 uppercase letter</li>
                <li>At least 1 number</li>
              </ul>
            </div>

            <div
              className={`mt-3 flex items-center justify-between rounded-full px-2.5 py-1 text-[11px] ${strengthBgColors[strength.level]}`}
            >
              <span className="text-slate-200">Strength</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((lvl) => (
                  <span
                    key={lvl}
                    className={cn(
                      "h-1.5 w-8 rounded-full bg-slate-700/70 transition-colors",
                      lvl <= strength.level && strengthColors[strength.level]
                    )}
                  />
                ))}
                <span className="ml-1 text-xs text-slate-100">
                  {strength.label}
                </span>
              </div>
            </div>
          </FieldShell>

          <FieldShell label="Confirm new password">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-slate-700/70 bg-slate-900/70 pl-9 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-sky-500/60 focus-visible:ring-2 focus-visible:ring-sky-500/60"
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-slate-400 hover:text-slate-200"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FieldShell>

          <Button
            type="submit"
            className="mt-1 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 text-sm font-medium text-slate-50 shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition hover:from-emerald-400 hover:to-sky-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-70"
            disabled={submitting}
          >
            {submitting && (
              <Loader2 className="h-4 w-4 animate-spin text-slate-50" />
            )}
            {submitting ? "Updating password…" : "Change password"}
          </Button>
        </form>
      </CardContent>
    </AuthShell>
  );
};

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
