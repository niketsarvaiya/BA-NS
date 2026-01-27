"use client";

import {
  FolderKanban,
  ListChecks,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  MessageSquare,
  Plus,
  Users,
  ClipboardList,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  // Today at a Glance data
  const glanceMetrics = [
    { label: "On Track", value: 9, status: "success", icon: CheckCircle2 },
    { label: "Needs Attention", value: 3, status: "warning", icon: Clock },
    { label: "Critical", value: 2, status: "critical", icon: AlertTriangle },
  ];

  // Your Focus Today data
  const focusItems = [
    {
      type: "task",
      title: "Complete QC checklist for Skyline Phase 2",
      project: "Project Skyline",
      priority: "high",
      due: "Today, 5:00 PM",
    },
    {
      type: "blocker",
      title: "Material delivery delayed - Greenfield Tower",
      project: "Greenfield Tower",
      priority: "critical",
      status: "Awaiting vendor confirmation",
    },
    {
      type: "task",
      title: "Review and approve site photos",
      project: "Northbridge Hub",
      priority: "medium",
      due: "Today, 6:30 PM",
    },
    {
      type: "risk",
      title: "Weather alert for tomorrow's concrete pour",
      project: "Harbor Point",
      priority: "warning",
      status: "Monitor forecast",
    },
  ];

  // Recent Activity timeline
  const activity = [
    {
      type: "visit",
      title: "Site visit completed",
      detail: "Project Skyline",
      time: "12m ago",
      icon: MapPin,
    },
    {
      type: "update",
      title: "QC checklist updated",
      detail: "Greenfield Tower",
      time: "35m ago",
      icon: CheckCircle2,
    },
    {
      type: "task",
      title: "New task assigned",
      detail: "Northbridge Hub",
      time: "1h ago",
      icon: ListChecks,
    },
    {
      type: "document",
      title: "Drawing revision uploaded",
      detail: "Harbor Point",
      time: "2h ago",
      icon: FileText,
    },
    {
      type: "message",
      title: "Client feedback received",
      detail: "Marina Bay",
      time: "3h ago",
      icon: MessageSquare,
    },
  ];

  // Quick Actions
  const quickActions = [
    { label: "Create Project", icon: Plus, accent: "primary" },
    { label: "Log Site Visit", icon: MapPin, accent: "success" },
    { label: "New Task List", icon: ClipboardList, accent: "primary" },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-page-title text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-body text-muted-foreground max-w-2xl">
          Your operations snapshot. What matters right now.
        </p>
      </div>

      {/* Today at a Glance - Horizontal Strip */}
      <div className="flex flex-wrap gap-3">
        {glanceMetrics.map((metric) => {
          const Icon = metric.icon;
          const statusColors = {
            success: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40",
            warning: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/40",
            critical: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/40",
          };
          const iconColors = {
            success: "text-emerald-700 dark:text-emerald-400",
            warning: "text-amber-700 dark:text-amber-400",
            critical: "text-red-700 dark:text-red-400",
          };
          const valueColors = {
            success: "text-emerald-900 dark:text-emerald-50",
            warning: "text-amber-900 dark:text-amber-50",
            critical: "text-red-900 dark:text-red-50",
          };

          return (
            <div
              key={metric.label}
              className={cn(
                "inline-flex items-center gap-3 rounded-[12px] border px-5 py-3 transition-smooth",
                statusColors[metric.status as keyof typeof statusColors]
              )}
            >
              <Icon className={cn("h-5 w-5", iconColors[metric.status as keyof typeof iconColors])} />
              <div>
                <p
                  className={cn(
                    "text-2xl font-semibold tabular-nums",
                    valueColors[metric.status as keyof typeof valueColors]
                  )}
                >
                  {metric.value}
                </p>
                <p className="text-meta text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Layout: Focus Card + Side Panels */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* PRIMARY: Your Focus Today - Dominant Card */}
        <Card className="lg:row-span-2 border-border bg-card shadow-md">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-section-header text-foreground">Your Focus Today</h2>
            <p className="mt-1 text-meta text-muted-foreground">
              Tasks, blockers, and risks that need your attention now.
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {focusItems.map((item, index) => {
                const priorityStyles = {
                  critical: {
                    border: "border-l-red-500",
                    bg: "bg-red-50/50 dark:bg-red-950/10",
                    label: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                  },
                  high: {
                    border: "border-l-amber-500",
                    bg: "bg-amber-50/50 dark:bg-amber-950/10",
                    label: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                  },
                  warning: {
                    border: "border-l-amber-500",
                    bg: "bg-amber-50/50 dark:bg-amber-950/10",
                    label: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                  },
                  medium: {
                    border: "border-l-blue-500",
                    bg: "bg-blue-50/50 dark:bg-blue-950/10",
                    label: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                  },
                };
                const style = priorityStyles[item.priority as keyof typeof priorityStyles];

                return (
                  <button
                    key={index}
                    type="button"
                    className={cn(
                      "group w-full rounded-[10px] border border-border bg-card p-4 text-left transition-smooth hover:shadow-md hover:border-primary/40",
                      "border-l-4",
                      style.border,
                      style.bg
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-2">
                          <span
                            className={cn(
                              "mt-0.5 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                              style.label
                            )}
                          >
                            {item.type}
                          </span>
                        </div>
                        <p className="text-body font-medium text-foreground leading-snug">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-3 text-meta text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <FolderKanban className="h-3 w-3" />
                            {item.project}
                          </span>
                          {item.due && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3 w-3" />
                              {item.due}
                            </span>
                          )}
                          {item.status && (
                            <span className="flex items-center gap-1.5">
                              <AlertTriangle className="h-3 w-3" />
                              {item.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* SECONDARY: Recent Activity - Vertical Timeline */}
        <Card className="border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-section-header text-foreground">Recent Activity</h2>
            <p className="mt-1 text-meta text-muted-foreground">
              Latest movements across projects.
            </p>
          </div>
          <div className="max-h-[400px] overflow-y-auto p-5">
            <div className="relative space-y-4">
              {/* Timeline line */}
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />

              {activity.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="relative flex gap-3 group">
                    {/* Timeline node */}
                    <div className="relative z-10 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-border bg-card group-hover:border-primary transition-smooth">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground group-hover:bg-primary transition-smooth" />
                    </div>

                    {/* Content */}
                    <button
                      type="button"
                      className="flex-1 min-w-0 rounded-[8px] border border-transparent px-3 py-2 text-left hover:border-border hover:bg-muted/30 transition-smooth"
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-medium text-foreground leading-snug">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 text-meta text-muted-foreground">
                            <span>{item.detail}</span>
                            <span>•</span>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* TERTIARY: Quick Actions - Intent-driven Panel */}
        <Card className="border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-section-header text-foreground">Quick Actions</h2>
            <p className="mt-1 text-meta text-muted-foreground">
              Common tasks, one click away.
            </p>
          </div>
          <div className="p-5">
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    className="group flex w-full items-center gap-3 rounded-[10px] border border-border bg-background px-4 py-3 text-left hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-smooth"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-smooth">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="flex-1 text-body font-medium text-foreground">
                      {action.label}
                    </span>
                    <div className="h-2 w-2 rounded-full bg-border group-hover:bg-primary transition-smooth" />
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
