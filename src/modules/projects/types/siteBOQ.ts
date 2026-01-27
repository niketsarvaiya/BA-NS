// ⚠️ BACKEND CONTRACT: Do not modify these types without backend coordination

// BACKEND NOTE:
// Each status will later be driven by task + activity completion

// BACKEND NOTE:
// Partial states will be supported when quantity > 1

export interface SiteBOQItemStatus {
  ordered: boolean;
  assigned: boolean;
  delivered: boolean;
  installed: boolean;
  programmed: boolean;
  qced: boolean;
}

export interface SiteBOQItemUnit {
  unitId: string;
  unitNumber: number; // 1, 2, 3, etc.
  roomId?: string;
  roomName?: string;
  status: SiteBOQItemStatus;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

export interface SiteBOQItem {
  id: string;
  projectId: string;
  itemName: string;
  description?: string;
  quantity: number;
  status: SiteBOQItemStatus; // Aggregated status (all units)
  units?: SiteBOQItemUnit[]; // Per-unit tracking for qty > 1
  lastUpdatedAt: string;
  lastUpdatedBy: string;
}

export interface SiteBOQFilters {
  search?: string;
  notDelivered?: boolean;
  notInstalled?: boolean;
  notProgrammed?: boolean;
  notQCed?: boolean;
  showOnlyPending?: boolean;
}

export type SiteBOQStatusField = keyof SiteBOQItemStatus;

export interface StatusHistoryEntry {
  id: string;
  field: SiteBOQStatusField;
  oldValue: boolean;
  newValue: boolean;
  updatedBy: string;
  updatedAt: string;
  notes?: string;
}
