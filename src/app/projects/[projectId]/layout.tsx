"use client";

import React from "react";
import { ProjectLayout } from "@/modules/projects/layouts/ProjectLayout";

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectLayout>{children}</ProjectLayout>;
}
