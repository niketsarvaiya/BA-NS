import type { SiteBOQItem } from "../../types/siteBOQ";
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";
import { Package, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SiteBOQItemDetailPanelProps {
  item: SiteBOQItem;
  onClose: () => void;
}

export function SiteBOQItemDetailPanel({ item, onClose }: SiteBOQItemDetailPanelProps) {
  const iconElement = (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/20">
      <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
    </div>
  );

  // Calculate current bottleneck
  const getBottleneck = () => {
    if (!item.status.ordered) return "Not Ordered";
    if (!item.status.assigned) return "Not Assigned";
    if (!item.status.delivered) return "Not Delivered";
    if (!item.status.installed) return "Not Installed";
    if (!item.status.programmed) return "Not Programmed";
    if (!item.status.qced) return "Not QCed";
    return null;
  };

  const bottleneck = getBottleneck();
  const isComplete = Object.values(item.status).every((v) => v);

  return (
    <DetailPanel
      isOpen={true}
      onClose={onClose}
      title={item.itemName}
      subtitle={`Site BOQ Item • ${item.quantity} units`}
      icon={iconElement}
      width="lg"
    >
      <div className="space-y-6">
        {/* Item Summary */}
        <div className="grid grid-cols-2 gap-4">
          <DetailPanelSection title="Description">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {item.description || "—"}
            </div>
          </DetailPanelSection>

          <DetailPanelSection title="Quantity">
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {item.quantity}
            </div>
          </DetailPanelSection>
        </div>

        {/* Current Bottleneck */}
        {bottleneck ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Current Bottleneck
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  {bottleneck}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                  Item Complete
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">
                  All lifecycle stages completed
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Breakdown */}
        <DetailPanelSection title="Lifecycle Status">
          <div className="space-y-2">
            <StatusRow label="Ordered" value={item.status.ordered} />
            <StatusRow label="Assigned" value={item.status.assigned} />
            <StatusRow label="Delivered" value={item.status.delivered} />
            <StatusRow label="Installed" value={item.status.installed} />
            <StatusRow label="Programmed" value={item.status.programmed} />
            <StatusRow label="QC Approved" value={item.status.qced} />
          </div>
        </DetailPanelSection>

        {/* Last Updated */}
        <DetailPanelSection title="Last Updated" icon={<Clock className="h-3.5 w-3.5" />}>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {new Date(item.lastUpdatedAt).toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            By {item.lastUpdatedBy}
          </div>
        </DetailPanelSection>

        {/* Related Information - Placeholder */}
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Additional features coming soon:
          </p>
          <ul className="mt-2 text-xs text-slate-400 dark:text-slate-500 space-y-1">
            <li>• Related tasks ({Math.floor(Math.random() * 5) + 1})</li>
            <li>• Related activities ({Math.floor(Math.random() * 8) + 2})</li>
            <li>• Status change history</li>
            <li>• Room allocations</li>
          </ul>
        </div>
      </div>
    </DetailPanel>
  );
}

// Helper component for status rows
function StatusRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {label}
      </span>
      <Badge
        variant={value ? "success" : "muted"}
        className="text-xs"
      >
        {value ? "Completed" : "Pending"}
      </Badge>
    </div>
  );
}
