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
          <h1 className="text-page-title text-foreground">
            Projects
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl">
            Track execution across all active sites.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex h-9 text-xs transition-smooth"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            size="sm"
            className="h-9 text-xs transition-smooth"
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
              className="border-border bg-card shadow-sm hover:shadow-md transition-smooth"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-meta text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <ProjectsFiltersBar />

      {/* Main Content: Table or Empty State */}
      {showEmpty ? (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <FolderOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-body text-muted-foreground max-w-sm mb-6">
              Create your first project to start tracking execution, tasks, and
              site visits.
            </p>
            <Button
              size="sm"
              className="h-9 text-xs transition-smooth"
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
