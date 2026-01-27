import { Check } from "lucide-react";
import { STAGE_CONFIGS, type ProjectStage } from "../types/dashboard";
import { cn } from "@/lib/utils";

interface StageProgressBarProps {
  currentStage: ProjectStage;
}

export function StageProgressBar({ currentStage }: StageProgressBarProps) {
  const currentOrder = STAGE_CONFIGS.find((s) => s.id === currentStage)?.order ?? 1;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        {STAGE_CONFIGS.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isCompleted = stage.order < currentOrder;
          const isLast = index === STAGE_CONFIGS.length - 1;

          return (
            <div key={stage.id} className="flex items-center flex-1">
              {/* Stage Circle */}
              <div className="flex flex-col items-center gap-2 relative">
                <button
                  type="button"
                  className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted &&
                      "border-emerald-500 dark:border-emerald-500 bg-emerald-500 dark:bg-emerald-500 text-white",
                    isActive &&
                      "border-primary bg-primary text-white shadow-lg",
                    !isActive &&
                      !isCompleted &&
                      "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stage.order}</span>
                  )}
                </button>

                {/* Stage Label */}
                <span
                  className={cn(
                    "text-xs font-medium text-center whitespace-nowrap",
                    isActive && "text-zinc-900 dark:text-zinc-50 font-semibold",
                    !isActive && "text-zinc-500 dark:text-zinc-400"
                  )}
                >
                  {stage.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    isCompleted
                      ? "bg-emerald-500 dark:bg-emerald-500"
                      : "bg-zinc-200 dark:bg-zinc-800"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
