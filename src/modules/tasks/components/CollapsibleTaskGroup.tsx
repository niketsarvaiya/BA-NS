"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, MapPin, Wrench, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoleBasedTask } from "../types/role-tasks";
import { RoleTaskItem } from "./RoleTaskItem";

interface CollapsibleTaskGroupProps {
  title: string;
  tasks: RoleBasedTask[];
  icon?: "room" | "general" | "hygiene";
  defaultExpanded?: boolean;
  onTaskClick: (task: RoleBasedTask) => void;
}

const iconMap = {
  room: MapPin,
  general: Wrench,
  hygiene: Sparkles,
};

export function CollapsibleTaskGroup({
  title,
  tasks,
  icon = "room",
  defaultExpanded = true,
  onTaskClick,
}: CollapsibleTaskGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const Icon = iconMap[icon];

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "DONE").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    blocked: tasks.filter((t) => t.status === "BLOCKED").length,
  };

  const progressPercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950/70 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
          "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
        )}
      >
        {/* Expand/Collapse Icon */}
        <div className="flex-shrink-0 text-zinc-400">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>

        {/* Group Icon */}
        <div
          className={cn(
            "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center",
            icon === "room" && "bg-blue-50 dark:bg-blue-950/30",
            icon === "general" && "bg-amber-50 dark:bg-amber-950/30",
            icon === "hygiene" && "bg-emerald-50 dark:bg-emerald-950/30"
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4",
              icon === "room" && "text-blue-600 dark:text-blue-400",
              icon === "general" && "text-amber-600 dark:text-amber-400",
              icon === "hygiene" && "text-emerald-600 dark:text-emerald-400"
            )}
          />
        </div>

        {/* Title & Stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50 truncate">
              {title}
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              ({stats.done}/{stats.total})
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-1.5 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                progressPercent === 100
                  ? "bg-emerald-500"
                  : progressPercent > 0
                  ? "bg-blue-500"
                  : "bg-zinc-200 dark:bg-zinc-700"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Status badges */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {stats.blocked > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {stats.blocked} blocked
            </span>
          )}
          {stats.inProgress > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {stats.inProgress} in progress
            </span>
          )}
        </div>
      </button>

      {/* Task List */}
      {isExpanded && (
        <div className="border-t border-zinc-100 dark:border-zinc-800">
          {tasks.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No tasks in this group
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {tasks.map((task) => (
                <RoleTaskItem
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
