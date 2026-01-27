"use client";

import * as React from "react";
import { Camera, Flag, Image as ImageIcon, Link2, MessageCircle, XCircle } from "lucide-react";
import type { FieldTask } from "../types";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { Button } from "@/components/ui/button";

export type FieldFilter = "all" | "flagged" | "blocked" | "with-photos" | "touched-by-me";

interface FieldSiteTasksViewProps {
  siteName: string;
  tasks: FieldTask[];
  onBack: () => void;
  onTaskAction: (task: FieldTask) => void;
}

export function FieldSiteTasksView({ siteName, tasks, onBack, onTaskAction }: FieldSiteTasksViewProps) {
  const [filter, setFilter] = React.useState<FieldFilter>("all");

  const filtered = React.useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "flagged") return !!t.flag?.isFlagged;
      if (filter === "blocked") return !!t.block?.isBlocked;
      if (filter === "with-photos") return t.photos.length > 0;
      // "touched-by-me" would require user context from events; skip for now.
      return true;
    });
  }, [tasks, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
        >
          <XCircle className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{siteName}</h1>
          <p className="text-xs text-muted-foreground">All open tasks at this site</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 text-xs">
        {(
          [
            { id: "all", label: "All" },
            { id: "flagged", label: "Flagged" },
            { id: "blocked", label: "Blocked" },
            { id: "with-photos", label: "With Photos" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 ${
              filter === f.id
                ? "bg-primary/10 border-primary/60 text-primary"
                : "bg-muted border-border text-muted-foreground"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2 pb-16">
        {filtered.map((task) => {
          const isFlagged = !!task.flag?.isFlagged;
          const isBlocked = !!task.block?.isBlocked;

          return (
            <button
              key={task.base.id}
              type="button"
              onClick={() => onTaskAction(task)}
              className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm hover:border-primary/40 hover:shadow-md transition-smooth flex gap-3"
            >
              <div
                className={`w-1 rounded-full mt-1 ${
                  isBlocked ? "bg-red-500" : isFlagged ? "bg-amber-500" : "bg-muted"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className="flex-1 text-sm font-medium text-foreground leading-snug truncate">
                    {task.base.title}
                  </p>
                  {task.photos.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      <ImageIcon className="h-3 w-3" />
                      {task.photos.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  {task.base.roomId && (
                    <span>📍 {task.base.roomId}</span>
                  )}
                  {isFlagged && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5">
                      <Flag className="h-3 w-3" />
                      Flagged
                    </span>
                  )}
                  {isBlocked && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 px-2 py-0.5">
                      <Link2 className="h-3 w-3" />
                      Blocked
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            No tasks match this filter.
          </div>
        )}
      </div>

      {/* Site-level camera FAB */}
      <button
        type="button"
        className="fixed bottom-4 right-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
        // Camera behavior will be wired from parent via a separate handler in the Field page
      >
        <Camera className="h-5 w-5" />
      </button>
    </div>
  );
}
