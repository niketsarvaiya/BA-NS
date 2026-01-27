"use client";

import React, { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Filter, CheckCircle2, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SiteBOQItem, SiteBOQFilters, SiteBOQStatusField } from "@/modules/projects/types/siteBOQ";
import { MOCK_SITE_BOQ_ITEMS } from "@/modules/projects/utils/mockSiteBOQData";
import { SiteBOQItemDetailPanel } from "@/modules/projects/components/siteboq/SiteBOQItemDetailPanel";

// BACKEND NOTE:
// Replace MOCK_SITE_BOQ_ITEMS with API call to /api/projects/[id]/site-boq

export default function SiteBOQPage() {
  const router = useRouter();
  const pathname = usePathname();
  const projectId = pathname.split("/")[2];

  const [items] = useState<SiteBOQItem[]>(MOCK_SITE_BOQ_ITEMS);
  const [filters, setFilters] = useState<SiteBOQFilters>({});
  const [selectedItem, setSelectedItem] = useState<SiteBOQItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{
    item: SiteBOQItem;
    field: SiteBOQStatusField;
  } | null>(null);
  const [expandedItemIds, setExpandedItemIds] = useState<Set<string>>(new Set());

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !item.itemName.toLowerCase().includes(search) &&
          !item.description?.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (filters.notDelivered && item.status.delivered) return false;
      if (filters.notInstalled && item.status.installed) return false;
      if (filters.notProgrammed && item.status.programmed) return false;
      if (filters.notQCed && item.status.qced) return false;

      if (filters.showOnlyPending) {
        // Check if any status is false
        const isPending = Object.values(item.status).some((val) => !val);
        if (!isPending) return false;
      }

      return true;
    });
  }, [items, filters]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const total = items.length;
    const delivered = items.filter((i) => i.status.delivered).length;
    const installed = items.filter((i) => i.status.installed).length;
    const qced = items.filter((i) => i.status.qced).length;

    return {
      total,
      deliveredPercent: total > 0 ? Math.round((delivered / total) * 100) : 0,
      installedPercent: total > 0 ? Math.round((installed / total) * 100) : 0,
      qcedPercent: total > 0 ? Math.round((qced / total) * 100) : 0,
    };
  }, [items]);

  // Toggle expand/collapse
  const toggleExpand = (itemId: string) => {
    setExpandedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Status pill component
  const StatusPill = ({ value, onClick }: { value: boolean; onClick: () => void }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
          value
            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/30 dark:text-green-400"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
        )}
      >
        {value ? "Y" : "N"}
      </button>
    );
  };

  const allComplete = filteredItems.every((item) => 
    Object.values(item.status).every((v) => v)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          BOQ
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dispatch totals + room allocations + execution tracking
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value="site" onValueChange={(v) => {
        if (v === "estimation") {
          router.push(`/projects/${projectId}/boq`);
        }
      }}>
        <TabsList>
          <TabsTrigger value="estimation">Estimation BOQ</TabsTrigger>
          <TabsTrigger value="site">Site BOQ</TabsTrigger>
          <TabsTrigger value="history" disabled>History</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total Items</p>
          <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {kpis.total}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Delivered</p>
          <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            {kpis.deliveredPercent}%
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Installed</p>
          <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
            {kpis.installedPercent}%
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">QC Completed</p>
          <p className="text-2xl font-semibold text-violet-600 dark:text-violet-400">
            {kpis.qcedPercent}%
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search items..."
            value={filters.search || ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.notDelivered ? "notDelivered" : filters.notInstalled ? "notInstalled" : filters.notProgrammed ? "notProgrammed" : filters.notQCed ? "notQCed" : "all"}
          onValueChange={(value) => {
            setFilters({
              ...filters,
              notDelivered: value === "notDelivered",
              notInstalled: value === "notInstalled",
              notProgrammed: value === "notProgrammed",
              notQCed: value === "notQCed",
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="notDelivered">Not Delivered</SelectItem>
            <SelectItem value="notInstalled">Not Installed</SelectItem>
            <SelectItem value="notProgrammed">Not Programmed</SelectItem>
            <SelectItem value="notQCed">Not QCed</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={filters.showOnlyPending ? "default" : "outline"}
          size="sm"
          onClick={() =>
            setFilters({ ...filters, showOnlyPending: !filters.showOnlyPending })
          }
        >
          Show Only Pending
        </Button>
      </div>

      {/* Table */}
      {filteredItems.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-12 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {items.length === 0
              ? "No items added to Site BOQ yet"
              : "No items match your filters"}
          </p>
        </div>
      ) : allComplete ? (
        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
          <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
            All items completed
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            {filteredItems.length} items have been QC approved
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Unit #
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Ordered
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Assigned
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Delivered
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Installed
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    Programmed
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                    QCed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-950/70 divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredItems.map((item) => {
                  const hasUnits = item.units && item.units.length > 0;
                  const isExpanded = expandedItemIds.has(item.id);
                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        onClick={() => setSelectedItem(item)}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          <div className="flex items-center gap-2">
                            {hasUnits && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(item.id);
                                }}
                                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                              >
                                <ChevronRight
                                  className={cn(
                                    "w-4 h-4 transition-transform",
                                    isExpanded && "rotate-90"
                                  )}
                                />
                              </button>
                            )}
                            {item.itemName}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                          {item.description || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-zinc-900 dark:text-zinc-50">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusPill
                            value={item.status.ordered}
                            onClick={() => setSelectedStatus({ item, field: "ordered" })}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusPill
                            value={item.status.assigned}
                            onClick={() => setSelectedStatus({ item, field: "assigned" })}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusPill
                            value={item.status.delivered}
                            onClick={() => setSelectedStatus({ item, field: "delivered" })}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusPill
                            value={item.status.installed}
                            onClick={() => setSelectedStatus({ item, field: "installed" })}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusPill
                            value={item.status.programmed}
                            onClick={() => setSelectedStatus({ item, field: "programmed" })}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusPill
                            value={item.status.qced}
                            onClick={() => setSelectedStatus({ item, field: "qced" })}
                          />
                        </td>
                      </tr>
                      {hasUnits && isExpanded && (
                        <tr className="bg-zinc-50 dark:bg-zinc-950">
                          <td colSpan={9} className="px-4 py-4">
                            <div className="space-y-4">
                              {Object.entries(
                                item.units!.reduce((acc, unit) => {
                                  const roomKey = unit.roomName || 'Unassigned';
                                  if (!acc[roomKey]) {
                                    acc[roomKey] = [];
                                  }
                                  acc[roomKey].push(unit);
                                  return acc;
                                }, {} as Record<string, typeof item.units>)
                              ).map(([roomName, units]) => (
                                <div key={roomName} className="ml-8">
                                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                                    {roomName} ({units.length} {units.length === 1 ? 'unit' : 'units'})
                                  </div>
                                  <div className="space-y-1.5">
                                    {units.map((unit) => (
                                      <div key={unit.unitId} className="flex items-center gap-4 text-xs bg-white dark:bg-zinc-900/50 p-2 rounded border border-zinc-200 dark:border-zinc-800">
                                        <div className="w-16 text-zinc-600 dark:text-zinc-400 font-medium">
                                          Unit {unit.unitNumber}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-zinc-500 dark:text-zinc-500 w-16">Ordered:</span>
                                          <span
                                            className={cn(
                                              "inline-block px-2 py-0.5 text-xs font-medium rounded",
                                              unit.status.ordered
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                            )}
                                          >
                                            {unit.status.ordered ? "Y" : "N"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-zinc-500 dark:text-zinc-500 w-16">Assigned:</span>
                                          <span
                                            className={cn(
                                              "inline-block px-2 py-0.5 text-xs font-medium rounded",
                                              unit.status.assigned
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                            )}
                                          >
                                            {unit.status.assigned ? "Y" : "N"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-zinc-500 dark:text-zinc-500 w-16">Delivered:</span>
                                          <span
                                            className={cn(
                                              "inline-block px-2 py-0.5 text-xs font-medium rounded",
                                              unit.status.delivered
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                            )}
                                          >
                                            {unit.status.delivered ? "Y" : "N"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-zinc-500 dark:text-zinc-500 w-16">Installed:</span>
                                          <span
                                            className={cn(
                                              "inline-block px-2 py-0.5 text-xs font-medium rounded",
                                              unit.status.installed
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                            )}
                                          >
                                            {unit.status.installed ? "Y" : "N"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-zinc-500 dark:text-zinc-500 w-20">Programmed:</span>
                                          <span
                                            className={cn(
                                              "inline-block px-2 py-0.5 text-xs font-medium rounded",
                                              unit.status.programmed
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                            )}
                                          >
                                            {unit.status.programmed ? "Y" : "N"}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-zinc-500 dark:text-zinc-500 w-12">QCed:</span>
                                          <span
                                            className={cn(
                                              "inline-block px-2 py-0.5 text-xs font-medium rounded",
                                              unit.status.qced
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                            )}
                                          >
                                            {unit.status.qced ? "Y" : "N"}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Item Detail Panel */}
      {selectedItem && (
        <SiteBOQItemDetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* Status History Placeholder */}
      {selectedStatus && (
        <div className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm" onClick={() => setSelectedStatus(null)}>
          <div className="fixed top-16 bottom-0 right-0 w-[400px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Status History
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              History for {selectedStatus.item.itemName} - {selectedStatus.field}
            </p>
            <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Status change history coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
