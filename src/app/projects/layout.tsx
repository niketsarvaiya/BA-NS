"use client";

import React from "react";
import { AppShell } from "@/modules/app-shell/components/AppShell";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
