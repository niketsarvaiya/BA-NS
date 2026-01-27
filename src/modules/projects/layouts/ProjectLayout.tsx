"use client";

import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectHeader } from "../components/ProjectHeader";
import { ProjectTabs } from "../components/ProjectTabs";
import { getProjectById } from "../utils/mockData";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export function ProjectLayout({ children }: ProjectLayoutProps) {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/projects">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:text-zinc-50"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Projects
            </Button>
          </Link>
        </div>
        <div className="rounded-lg border border-zinc-300 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/60 p-8 text-center">
          <p className="text-zinc-400 dark:text-zinc-400">Project not found: {projectId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-3">
        <Link href="/projects">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:text-zinc-50"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Project Header */}
      <ProjectHeader project={project} />

      {/* Main project layout */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex-1 min-w-0">
          <div className="overflow-hidden rounded-lg border border-zinc-300 bg-zinc-50 shadow-sm dark:border-zinc-800/70 dark:bg-zinc-950/60">
            <ProjectTabs />

            {/* Content Area */}
            <div className="p-4 md:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
