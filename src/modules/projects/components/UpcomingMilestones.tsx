import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Milestone } from "../types/dashboard";

interface UpcomingMilestonesProps {
  milestones: Milestone[];
}

export function UpcomingMilestones({ milestones }: UpcomingMilestonesProps) {
  const upcomingMilestones = milestones.slice(0, 3);

  return (
    <div className="rounded-lg border border-zinc-200/80 bg-white/70 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        Upcoming milestones
      </h3>
      <p className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
        Next 2–3 checkpoints that can change project risk
      </p>

      {upcomingMilestones.length > 0 ? (
        <div className="space-y-4">
          {upcomingMilestones.map((milestone, index) => {
            const isOverdue = milestone.status === "OVERDUE";
            const isDueSoon = milestone.daysUntil <= 3 && milestone.daysUntil >= 0;

            return (
              <div
                key={milestone.id}
                className={cn(
                  "p-4 rounded-lg border",
                  isOverdue
                    ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                    : isDueSoon
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                    : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800"
                )}
              >
                {/* Milestone Title */}
                <p
                  className={cn(
                    "text-sm font-semibold mb-2",
                    isOverdue
                      ? "text-red-900 dark:text-red-100"
                      : isDueSoon
                      ? "text-amber-900 dark:text-amber-100"
                      : "text-zinc-900 dark:text-zinc-50"
                  )}
                >
                  {milestone.title}
                </p>

                {/* Date and Status */}
                <div className="flex items-center justify-between text-xs">
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      isOverdue
                        ? "text-red-700 dark:text-red-300"
                        : isDueSoon
                        ? "text-amber-700 dark:text-amber-300"
                        : "text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    <span>{milestone.date}</span>
                  </div>

                  {/* Status Badge */}
                  {isOverdue ? (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">
                      Overdue
                    </span>
                  ) : isDueSoon ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">
                      Due soon
                    </span>
                  ) : milestone.status === "COMPLETED" ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                      {milestone.daysUntil}d left
                    </span>
                  )}
                </div>

                {/* Progress bar if in progress */}
                {milestone.status === "IN_PROGRESS" && milestone.progress !== undefined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        Progress
                      </span>
                      <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                        {milestone.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all"
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No upcoming milestones
          </p>
        </div>
      )}
    </div>
  );
}
