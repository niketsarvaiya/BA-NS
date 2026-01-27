import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Priority, Blocker } from "../types/dashboard";
import { Button } from "@/components/ui/button";

interface TodaysFocusProps {
  priorities: Priority[];
  blocker?: Blocker | null;
  actionButtons?: Array<{
    label: string;
    variant?: "default" | "outline" | "ghost";
    onClick?: () => void;
  }>;
}

export function TodaysFocus({
  priorities,
  // Blockers are now handled by a dedicated "Active Blockers" strip on the page
  blocker,
  actionButtons = [],
}: TodaysFocusProps) {
  const topPriorities = priorities.slice(0, 3);

  return (
    <div className="rounded-lg border border-zinc-200/80 bg-white/70 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="mb-5 flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Today&apos;s Focus
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Top 3 moves to keep this project on track
        </p>
      </div>

      {/* Top Priorities */}
      {topPriorities.length > 0 ? (
        <div className="space-y-3 mb-6">
          {topPriorities.map((priority, index) => (
            <div
              key={priority.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-3.5 text-sm dark:border-zinc-800/80 dark:bg-zinc-900/70"
            >
              <div
                className={cn(
                  "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  priority.urgency === "HIGH"
                    ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    : priority.urgency === "MEDIUM"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                )}
              >
                {index + 1}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                  {priority.title}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{priority.assignee}</span>
                  {priority.dueDate && (
                    <>
                      <span>•</span>
                      <span>Due: {priority.dueDate}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                {priority.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={actionButtons[0]?.onClick}
                    className="h-7 gap-1 px-2 text-[11px]"
                  >
                    View task
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-dashed border-zinc-300/70 bg-zinc-50/60 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700/70 dark:bg-zinc-900/70 dark:text-zinc-400">
          No priorities set for today.
        </div>
      )}

      {/* Secondary stage actions */}
      {actionButtons.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actionButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || "default"}
              size="sm"
              onClick={button.onClick}
              className="gap-2"
            >
              {button.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
