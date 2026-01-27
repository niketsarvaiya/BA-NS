import { Layers, Package, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScopeCompletenessStripProps {
  roomsCount: number;
  itemsCount: number;
  lastUpdated: string;
}

export function ScopeCompletenessStrip({
  roomsCount,
  itemsCount,
  lastUpdated,
}: ScopeCompletenessStripProps) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Rooms</p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {roomsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Scope Items
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {itemsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Last Updated
              </p>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button disabled className="gap-2">
                  <FileText className="h-4 w-4" />
                  Generate BOQ
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Finalize rooms + scope to unlock BOQ</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
