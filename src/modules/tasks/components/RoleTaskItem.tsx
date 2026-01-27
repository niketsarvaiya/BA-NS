"use client";

import { Flag, AlertTriangle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoleBasedTask } from "../types/role-tasks";
import { StatusBadge, PriorityBadge } from "./TaskBadges";

interface RoleTaskItemProps {
  task: RoleBasedTask;
  onClick: () => void;
  showRoom?: boolean;
}

export function RoleTaskItem({ task, onClick, showRoom = false }: RoleTaskItemProps) {
  const isBlocked = task.status === "BLOCKED";
  const isFlagged = task.flagged;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group",
        "hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
        isBlocked && "bg-red-50/50 dark:bg-red-950/10"
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "flex-shrink-0 h-2 w-2 rounded-full",
          task.status === "DONE" && "bg-emerald-500",
          task.status === "IN_PROGRESS" && "bg-blue-500",
          task.status === "BLOCKED" && "bg-red-500",
          task.status === "NOT_STARTED" && "bg-zinc-300 dark:bg-zinc-600"
        )}
      />

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">
            {task.title}
          </h4>
          {isFlagged && (
            <Flag className="h-3.5 w-3.5 flex-shrink-0 text-orange-500" />
          )}
          {isBlocked && (
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
          )}
        </div>

        {task.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
            {task.description}
          </p>
        )}

        {/* Flag reason if present */}
        {isFlagged && task.flagReason && (
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
            <Flag className="h-3 w-3" />
            {task.flagReason}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <PriorityBadge priority={task.priority} />
        <StatusBadge status={task.status} />
      </div>

      {/* Chevron */}
      <ChevronRight className="h-4 w-4 flex-shrink-0 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

// Compact version for dependency lists
export function CompactTaskItem({
  task,
  onClick,
}: {
  task: RoleBasedTask;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors",
        "hover:bg-zinc-100 dark:hover:bg-zinc-800"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 h-1.5 w-1.5 rounded-full",
          task.status === "DONE" && "bg-emerald-500",
          task.status === "IN_PROGRESS" && "bg-blue-500",
          task.status === "BLOCKED" && "bg-red-500",
          task.status === "NOT_STARTED" && "bg-zinc-300 dark:bg-zinc-600"
        )}
      />
      <span className="text-sm text-zinc-700 dark:text-zinc-300 truncate flex-1">
        {task.title}
      </span>
      {task.flagged && <Flag className="h-3 w-3 text-orange-500 flex-shrink-0" />}
      <StatusBadge status={task.status} />
    </button>
  );
}
