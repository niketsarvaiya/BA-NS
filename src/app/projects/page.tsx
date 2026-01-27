"use client";

import { useState } from "react";
import {
  FolderKanban,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Download,
  Plus,
  FolderOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectsFiltersBar } from "./components/ProjectsFiltersBar";
import { ProjectsTable } from "./components/ProjectsTable";

export default function ProjectsPage() {
  const [showEmpty] = useState(false);

  const stats = [
    { label: "Active Projects", value: 12, icon: FolderKanban },
    { label: "At Risk", value: 3, icon: AlertTriangle },
    { label: "Pending QC", value: 5, icon: ShieldCheck },
    { label: "Overdue Tasks", value: 8, icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Projects
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-400 max-w-2xl">
            Track execution across all active sites.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex h-9 border-zinc-300 dark:border-zinc-700 bg-zinc-900/60 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800/80 transition-colors"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            size="sm"
            className="h-9 text-xs bg-primary hover:bg-primary/90 transition-colors"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border-zinc-300 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/60 shadow-sm hover:shadow-md transition-shadow duration-150"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-400">
                  {stat.label}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <ProjectsFiltersBar />

      {/* Main Content: Table or Empty State */}
      {showEmpty ? (
        <Card className="border-zinc-300 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/60 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-400 mb-4">
              <FolderOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
              No projects yet
            </h3>
            <p className="text-sm text-zinc-400 dark:text-zinc-400 max-w-sm mb-6">
              Create your first project to start tracking execution, tasks, and
              site visits.
            </p>
            <Button
              size="sm"
              className="h-9 text-xs bg-primary hover:bg-primary/90 transition-colors"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ProjectsTable />
      )}
    </div>
  );
}
