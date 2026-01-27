"use client";

import React from "react";
import { AppShell } from "@/modules/app-shell/components/AppShell";
import { useRequireRole } from "@/modules/auth/utils/guards";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authorized, loading } = useRequireRole(["admin"]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        <p>Checking admin access…</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
