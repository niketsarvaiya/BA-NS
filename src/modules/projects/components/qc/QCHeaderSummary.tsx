import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QCHeaderSummaryProps {
  totalChecks: number;
  passed: number;
  failed: number;
  pending: number;
  openSnags: number;
}

export function QCHeaderSummary({
  totalChecks,
  passed,
  failed,
  pending,
  openSnags,
}: QCHeaderSummaryProps) {
  const hasOpenSnags = openSnags > 0;

  return (
    <Card className="border-zinc-300/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 shadow-sm">
      <div className="flex flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:justify-between">
        {/* Metrics */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Metric label="Total Checks" value={totalChecks} />
          <Metric label="Passed" value={passed} tone="success" />
          <Metric label="Failed" value={failed} tone="danger" />
          <Metric label="Pending" value={pending} />

          <div className="flex items-center gap-1.5 pl-0 md:pl-4 border-none md:border-l md:border-zinc-200/80 dark:md:border-zinc-800/80">
            <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Open snags
            </span>
            <Badge
              variant={hasOpenSnags ? "destructive" : "outline"}
              className={hasOpenSnags ? "bg-amber-500/10 text-amber-800 border-amber-500/60 dark:bg-amber-500/15 dark:text-amber-200" : "border-zinc-300/80 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300"}
            >
              {openSnags}
            </Badge>
          </div>
        </div>

        {/* Handover readiness */}
        <div className="flex items-center gap-3">
          {hasOpenSnags ? (
            <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">
                Resolve all open snags before marking this project ready for handover.
              </span>
              <span className="sm:hidden">Resolve snags before handover.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">All snags closed. You can proceed to client handover.</span>
              <span className="sm:hidden">No open snags.</span>
            </div>
          )}

          <Button
            size="sm"
            variant={hasOpenSnags ? "outline" : "default"}
            disabled={hasOpenSnags}
            className={
              hasOpenSnags
                ? "border-zinc-300/80 text-zinc-500 dark:border-zinc-700/80 dark:text-zinc-400 cursor-not-allowed"
                : ""
            }
          >
            Mark ready for handover
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface MetricProps {
  label: string;
  value: number;
  tone?: "default" | "success" | "danger";
}

function Metric({ label, value, tone = "default" }: MetricProps) {
  const toneClasses =
    tone === "success"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "danger"
      ? "text-red-600 dark:text-red-400"
      : "text-zinc-900 dark:text-zinc-50";

  return (
    <div className="space-y-0.5">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className={`text-base font-semibold ${toneClasses}`}>{value}</p>
    </div>
  );
}
