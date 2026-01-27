import { StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AreaSelect } from "./SharedComponents";
import type { BOQItem, Area } from "../../types/boq";

interface BOQDispatchViewProps {
  items: BOQItem[];
  onUpdateArea: (itemId: string, area: Area) => void;
}

export function BOQDispatchView({ items, onUpdateArea }: BOQDispatchViewProps) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="text-left p-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Item
              </th>
              <th className="text-left p-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Category
              </th>
              <th className="text-left p-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Area
              </th>
              <th className="text-center p-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Total Qty
              </th>
              <th className="text-center p-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Status
              </th>
              <th className="text-center p-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <td className="p-4">
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {item.name}
                  </p>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </td>
                <td className="p-4">
                  <AreaSelect
                    value={item.area}
                    onChange={(area) => onUpdateArea(item.id, area)}
                  />
                </td>
                <td className="p-4 text-center">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {item.qty}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <Badge
                    variant={item.status === "Ready" ? "success" : "warning"}
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="p-4 text-center">
                  {item.notes ? (
                    <div className="flex items-center justify-center gap-2">
                      <StickyNote className="h-4 w-4 text-amber-600 dark:text-amber-400 fill-current" />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        {item.notes}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400 dark:text-zinc-600">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
        {items.map((item) => (
          <div key={item.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <Badge
                    variant={item.status === "Ready" ? "success" : "warning"}
                    className="text-xs"
                  >
                    {item.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Qty</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.qty}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Area
                </p>
                <AreaSelect
                  value={item.area}
                  onChange={(area) => onUpdateArea(item.id, area)}
                />
              </div>

              {item.notes && (
                <div className="flex items-start gap-2 text-xs">
                  <StickyNote className="h-4 w-4 text-amber-600 dark:text-amber-400 fill-current flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-600 dark:text-zinc-400">
                    {item.notes}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No BOQ items available
          </p>
        </div>
      )}
    </div>
  );
}
