"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BOQStatusStrip } from "@/modules/projects/components/boq/BOQStatusStrip";
import { BOQDispatchView } from "@/modules/projects/components/boq/BOQDispatchView";
import { BOQAllocationView } from "@/modules/projects/components/boq/BOQAllocationView";
import type { BOQItem, AllocationUnit, Area, BOQView } from "@/modules/projects/types/boq";
import {
  MOCK_BOQ_ITEMS,
  MOCK_ROOMS,
  getMockAllocationUnits,
} from "@/modules/projects/utils/mockBOQData";

export default function BOQPage() {
  const router = useRouter();
  const pathname = usePathname();
  const projectId = pathname.split("/")[2];

  // State
  const [view, setView] = useState<BOQView>("dispatch");
  const [boqItems, setBOQItems] = useState<BOQItem[]>(MOCK_BOQ_ITEMS);
  const [allocationUnits, setAllocationUnits] = useState<AllocationUnit[]>(
    getMockAllocationUnits()
  );

  // Computed stats
  const stats = useMemo(() => {
    const totalItems = boqItems.length;
    const itemsMissingArea = boqItems.filter((item) => !item.area).length;

    // Count items with incomplete allocation
    const itemsPendingAllocation = boqItems.filter((item) => {
      const units = allocationUnits.filter((u) => u.boqItemId === item.id);
      const allocated = units.filter((u) => u.roomId).length;
      return allocated < units.length;
    }).length;

    return {
      totalItems,
      itemsPendingAllocation,
      itemsMissingArea,
    };
  }, [boqItems, allocationUnits]);

  // Handlers
  const handleUpdateArea = (itemId: string, area: Area) => {
    setBOQItems(
      boqItems.map((item) => (item.id === itemId ? { ...item, area } : item))
    );
  };

  const handleUpdateUnitRoom = (unitId: string, roomId: string) => {
    setAllocationUnits(
      allocationUnits.map((unit) =>
        unit.id === unitId ? { ...unit, roomId } : unit
      )
    );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
          BOQ
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dispatch totals + room allocations
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value="estimation" onValueChange={(v) => {
        if (v === "site") {
          router.push(`/projects/${projectId}/boq/site`);
        }
      }}>
        <TabsList>
          <TabsTrigger value="estimation">Estimation BOQ</TabsTrigger>
          <TabsTrigger value="site">Site BOQ</TabsTrigger>
          <TabsTrigger value="history" disabled>History</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Status Strip */}
      <BOQStatusStrip stats={stats} />

      {/* View Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as BOQView)}>
        <TabsList>
          <TabsTrigger value="dispatch">Dispatch View</TabsTrigger>
          <TabsTrigger value="allocation">Room Allocation View</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Content */}
      {view === "dispatch" ? (
        <BOQDispatchView items={boqItems} onUpdateArea={handleUpdateArea} />
      ) : (
        <BOQAllocationView
          items={boqItems}
          allocationUnits={allocationUnits}
          rooms={MOCK_ROOMS}
          onUpdateArea={handleUpdateArea}
          onUpdateUnitRoom={handleUpdateUnitRoom}
        />
      )}
    </div>
  );
}
