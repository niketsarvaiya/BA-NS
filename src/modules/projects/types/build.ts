export interface Room {
  id: string;
  name: string;
  order: number;
}

export interface ProductDictItem {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  unit?: string;
  description?: string;
}

export interface RoomScopeItem {
  id: string;
  roomId: string;
  productId: string;
  productName: string;
  category: string;
  qty: number;
  unit?: string;
  notes?: string;
}

export interface BuildProjectData {
  rooms: Room[];
  scopeItems: RoomScopeItem[];
  lastUpdated: string;
}

export type ProductCategory =
  | "Controls"
  | "Lighting"
  | "Curtains & Blinds"
  | "Audio Visual"
  | "Security"
  | "Networking"
  | "HVAC"
  | "Other";
