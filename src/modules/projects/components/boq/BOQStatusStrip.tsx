import { Package, AlertCircle, MapPin } from "lucide-react";
import type { BOQStats } from "../../types/boq";

interface BOQStatusStripProps {
  stats: BOQStats;
}

export function BOQStatusStrip({ stats }: BOQStatusStripProps) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Total Items */}
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Items</p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {stats.totalItems}
            </p>
          </div>
        </div>

        {/* Pending Allocation */}
        <div className="flex items-center gap-2">
          <AlertCircle
            className={`h-5 w-5 ${
              stats.itemsPendingAllocation > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pending Allocation
            </p>
            <p
              className={`text-lg font-semibold ${
                stats.itemsPendingAllocation > 0
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {stats.itemsPendingAllocation}
            </p>
          </div>
        </div>

        {/* Missing Area */}
        <div className="flex items-center gap-2">
          <MapPin
            className={`h-5 w-5 ${
              stats.itemsMissingArea > 0
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          />
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Missing Area
            </p>
            <p
              className={`text-lg font-semibold ${
                stats.itemsMissingArea > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {stats.itemsMissingArea}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
