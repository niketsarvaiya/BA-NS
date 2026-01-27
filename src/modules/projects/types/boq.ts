export type Area = "DB" | "Rack" | "Ceiling" | "Wall" | "Floor" | "Outdoor" | "Utility";

export const AREAS: Area[] = ["DB", "Rack", "Ceiling", "Wall", "Floor", "Outdoor", "Utility"];

export type BOQItemStatus = "Ready" | "Pending";

export interface BOQItem {
  id: string;
  name: string;
  category: string;
  qty: number;
  area?: Area;
  notes?: string;
  status: BOQItemStatus;
}

export interface AllocationUnit {
  id: string;
  boqItemId: string;
  unitIndex: number;
  roomId?: string;
  notes?: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface BOQStats {
  totalItems: number;
  itemsPendingAllocation: number;
  itemsMissingArea: number;
}

export type BOQView = "dispatch" | "allocation";
