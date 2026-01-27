import { AlertCircle, Calendar, Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectHealthStripProps {
  health: "HEALTHY" | "AT_RISK" | "CRITICAL";
  daysToHandover: number;
  openBlockers: number;
  pendingApprovals: number;
}

export function ProjectHealthStrip({
  health,
  daysToHandover,
  openBlockers,
  pendingApprovals,
}: ProjectHealthStripProps) {
  const healthConfig = {
    HEALTHY: {
      label: "Healthy",
      icon: CheckCircle,
      bgClass: "bg-emerald-100 dark:bg-emerald-950/30",
      textClass: "text-emerald-700 dark:text-emerald-400",
      borderClass: "border-emerald-200 dark:border-emerald-800",
    },
    AT_RISK: {
      label: "At Risk",
      icon: AlertCircle,
      bgClass: "bg-amber-100 dark:bg-amber-950/30",
      textClass: "text-amber-700 dark:text-amber-400",
      borderClass: "border-amber-200 dark:border-amber-800",
    },
    CRITICAL: {
      label: "Critical",
      icon: AlertCircle,
      bgClass: "bg-red-100 dark:bg-red-950/30",
      textClass: "text-red-700 dark:text-red-400",
      borderClass: "border-red-200 dark:border-red-800",
    },
  };

  const config = healthConfig[health];
  const HealthIcon = config.icon;

  const daysConfig =
    daysToHandover < 0
      ? {
          label: `${Math.abs(daysToHandover)}d overdue`,
          bgClass: "bg-red-100 dark:bg-red-950/30",
          textClass: "text-red-700 dark:text-red-400",
          borderClass: "border-red-200 dark:border-red-800",
        }
      : daysToHandover <= 7
      ? {
          label: `${daysToHandover}d to handover`,
          bgClass: "bg-amber-100 dark:bg-amber-950/30",
          textClass: "text-amber-700 dark:text-amber-400",
          borderClass: "border-amber-200 dark:border-amber-800",
        }
      : {
          label: `${daysToHandover}d to handover`,
          bgClass: "bg-blue-100 dark:bg-blue-950/30",
          textClass: "text-blue-700 dark:text-blue-400",
          borderClass: "border-blue-200 dark:border-blue-800",
        };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Health Status */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border",
          config.bgClass,
          config.textClass,
          config.borderClass
        )}
      >
        <HealthIcon className="h-4 w-4" />
        <span className="text-sm font-semibold">{config.label}</span>
      </div>

      {/* Days to Handover */}
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full border",
          daysConfig.bgClass,
          daysConfig.textClass,
          daysConfig.borderClass
        )}
      >
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-semibold">{daysConfig.label}</span>
      </div>

      {/* Open Blockers */}
      {openBlockers > 0 && (
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border",
            "bg-red-100 dark:bg-red-950/30",
            "text-red-700 dark:text-red-400",
            "border-red-200 dark:border-red-800"
          )}
        >
          <Lock className="h-4 w-4" />
          <span className="text-sm font-semibold">
            {openBlockers} {openBlockers === 1 ? "blocker" : "blockers"}
          </span>
        </div>
      )}

      {/* Pending Approvals */}
      {pendingApprovals > 0 && (
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border",
            "bg-purple-100 dark:bg-purple-950/30",
            "text-purple-700 dark:text-purple-400",
            "border-purple-200 dark:border-purple-800"
          )}
        >
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-semibold">
            {pendingApprovals} pending approval
          </span>
        </div>
      )}
    </div>
  );
}
