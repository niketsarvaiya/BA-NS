"use client";

import { Sparkles } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  statusMessage?: string | null;
}

export function AuthShell({
  children,
  title = "Beyond Assist",
  subtitle,
  statusMessage,
}: AuthShellProps) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Radial glow behind card */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.26),transparent_60%)] blur-3xl" />
      </div>

      {/* Blurred gradient blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.38),transparent_60%)] blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.45),transparent_60%)] blur-3xl opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(248,250,252,0.20),transparent_70%)] blur-3xl opacity-70" />

      {/* Subtle pattern grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),_transparent_55%),repeating-linear-gradient(90deg,rgba(148,163,184,0.08)_0,rgba(148,163,184,0.08)_1px,transparent_1px,transparent_24px),repeating-linear-gradient(0deg,rgba(148,163,184,0.08)_0,rgba(148,163,184,0.08)_1px,transparent_1px,transparent_24px)] opacity-40 mix-blend-soft-light" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.75)] backdrop-blur-xl sm:p-9">
            {/* Branding block */}
            <div className="mb-8 flex flex-col items-center text-center space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-slate-50 shadow-lg ring-2 ring-slate-100/20">
                <Sparkles className="h-7 w-7" />
              </div>

              <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight text-slate-50 sm:text-2xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-slate-400">
                    {subtitle}
                  </p>
                )}
                {statusMessage && (
                  <p className="text-xs font-medium text-slate-300">
                    {statusMessage}
                  </p>
                )}
              </div>
            </div>

            {children}

            {/* Footer */}
            <div className="mt-6 space-y-1 text-center text-xs text-slate-500">
              <p>
                Need access?{" "}
                <span className="font-medium text-slate-300">Contact Admin</span>
              </p>
              <p className="text-[11px] text-slate-600">v1.0</p>
            </div>

            {/* Dev-only demo credentials */}
            {isDev && (
              <details className="mt-5 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs text-slate-300">
                <summary className="cursor-pointer text-[11px] font-medium text-slate-200">
                  Demo credentials (dev only)
                </summary>
                <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <p>
                    <span className="font-semibold">admin</span> / admin123
                  </p>
                  <p>
                    <span className="font-semibold">supervisor</span> / supervisor123
                  </p>
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldShellProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children: React.ReactNode;
}

export function FieldShell({ label, children, className, ...rest }: FieldShellProps) {
  return (
    <div className={cn("space-y-1.5 text-sm", className)} {...rest}>
      <div className="text-slate-200">{label}</div>
      {children}
    </div>
  );
}
