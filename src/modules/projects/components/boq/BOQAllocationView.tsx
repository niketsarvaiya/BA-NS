"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaSelect,
  RoomSelect,
  AllocationProgressBadge,
} from "./SharedComponents";
import type { BOQItem, AllocationUnit, Room, Area } from "../../types/boq";
import { cn } from "@/lib/utils";

interface BOQAllocationViewProps {
  items: BOQItem[];
  allocationUnits: AllocationUnit[];
  rooms: Room[];
  onUpdateArea: (itemId: string, area: Area) => void;
  onUpdateUnitRoom: (unitId: string, roomId: string) => void;
}

export function BOQAllocationView({
  items,
  allocationUnits,
  rooms,
  onUpdateArea,
  onUpdateUnitRoom,
}: BOQAllocationViewProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getItemUnits = (itemId: string) => {
    return allocationUnits.filter((unit) => unit.boqItemId === itemId);
  };

  const getItemAllocationStats = (itemId: string) => {
    const units = getItemUnits(itemId);
    const allocated = units.filter((u) => u.roomId).length;
    return { allocated, total: units.length };
  };

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const units = getItemUnits(item.id);
        const { allocated, total } = getItemAllocationStats(item.id);
        const isExpanded = expandedItems.has(item.id);
        const isSingleQty = item.qty === 1;

        return (
          <div
            key={item.id}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 overflow-hidden"
          >
            {/* Main Row */}
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Expand button (only if qty > 1) */}
                {!isSingleQty && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={() => toggleExpand(item.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}

                {/* Item Info */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                          {item.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          Qty: {item.qty}
                        </span>
                        {!isSingleQty && (
                          <AllocationProgressBadge
                            allocated={allocated}
                            total={total}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Area and Room Selection */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                        Area
                      </p>
                      <AreaSelect
                        value={item.area}
                        onChange={(area) => onUpdateArea(item.id, area)}
                      />
                    </div>

                    {/* For qty=1, show room selector inline */}
                    {isSingleQty && units[0] && (
                      <div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                          Room
                        </p>
                        <RoomSelect
                          value={units[0].roomId}
                          onChange={(roomId) =>
                            onUpdateUnitRoom(units[0].id, roomId)
                          }
                          rooms={rooms}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Units (only for qty > 1) */}
            {!isSingleQty && isExpanded && (
              <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                <div className="p-4 space-y-2">
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-3">
                    Unit Allocation
                  </p>
                  <div className="space-y-2">
                    {units.map((unit) => (
                      <div
                        key={unit.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                          unit.roomId
                            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Badge
                            variant={unit.roomId ? "success" : "muted"}
                            className="text-xs"
                          >
                            Unit {unit.unitIndex}
                          </Badge>
                        </div>

                        <div className="flex-1">
                          <RoomSelect
                            value={unit.roomId}
                            onChange={(roomId) =>
                              onUpdateUnitRoom(unit.id, roomId)
                            }
                            rooms={rooms}
                            placeholder="Assign to room"
                          />
                        </div>

                        {unit.roomId && (
                          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            ✓ Allocated
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {items.length === 0 && (
        <div className="p-12 text-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No BOQ items available
          </p>
        </div>
      )}
    </div>
  );
}
