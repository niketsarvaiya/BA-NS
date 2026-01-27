import type { BOQItem, AllocationUnit, Room } from "../types/boq";

export const MOCK_ROOMS: Room[] = [
  { id: "room-1", name: "Living Room" },
  { id: "room-2", name: "Master Bedroom" },
  { id: "room-3", name: "Bedroom 2" },
  { id: "room-4", name: "Kitchen" },
  { id: "room-5", name: "Dining Area" },
  { id: "room-6", name: "Home Theater" },
  { id: "room-7", name: "Foyer" },
  { id: "room-8", name: "Balcony" },
];

export const MOCK_BOQ_ITEMS: BOQItem[] = [
  {
    id: "boq-001",
    name: "Keypad 4 Button",
    category: "Controls",
    qty: 8,
    area: "Wall",
    status: "Ready",
  },
  {
    id: "boq-002",
    name: "Touch Panel 7 inch",
    category: "Controls",
    qty: 3,
    area: "Wall",
    status: "Ready",
  },
  {
    id: "boq-003",
    name: "DALI Dimmable Light",
    category: "Lighting",
    qty: 24,
    area: "Ceiling",
    status: "Ready",
  },
  {
    id: "boq-004",
    name: "Phasecut Dimmer",
    category: "Lighting",
    qty: 12,
    area: "DB",
    status: "Ready",
  },
  {
    id: "boq-005",
    name: "Curtain Motor Silent",
    category: "Curtains & Blinds",
    qty: 6,
    status: "Pending",
  },
  {
    id: "boq-006",
    name: "In-Ceiling Speaker 8 inch",
    category: "Audio Visual",
    qty: 10,
    area: "Ceiling",
    status: "Ready",
  },
  {
    id: "boq-007",
    name: "AVR 7.2 Channel",
    category: "Audio Visual",
    qty: 1,
    area: "Rack",
    status: "Ready",
  },
  {
    id: "boq-008",
    name: "Projector Long Throw",
    category: "Audio Visual",
    qty: 1,
    status: "Pending",
  },
  {
    id: "boq-009",
    name: "CCTV Camera 4MP Outdoor",
    category: "Security",
    qty: 4,
    area: "Outdoor",
    status: "Ready",
  },
  {
    id: "boq-010",
    name: "Door Lock Smart",
    category: "Security",
    qty: 2,
    area: "Wall",
    status: "Ready",
  },
  {
    id: "boq-011",
    name: "Network Switch 24 Port PoE",
    category: "Networking",
    qty: 1,
    area: "Rack",
    status: "Ready",
  },
  {
    id: "boq-012",
    name: "WiFi Access Point",
    category: "Networking",
    qty: 5,
    area: "Ceiling",
    status: "Ready",
  },
  {
    id: "boq-013",
    name: "Smart Thermostat",
    category: "HVAC",
    qty: 3,
    status: "Pending",
  },
  {
    id: "boq-014",
    name: "Power Supply 12V 5A",
    category: "Other",
    qty: 15,
    area: "DB",
    status: "Ready",
  },
  {
    id: "boq-015",
    name: "Cable Cat6 305m",
    category: "Other",
    qty: 2,
    area: "Utility",
    status: "Ready",
    notes: "2 boxes required",
  },
];

// Generate allocation units for items with qty > 1
export function generateAllocationUnits(items: BOQItem[]): AllocationUnit[] {
  const units: AllocationUnit[] = [];

  items.forEach((item) => {
    for (let i = 0; i < item.qty; i++) {
      units.push({
        id: `${item.id}-unit-${i + 1}`,
        boqItemId: item.id,
        unitIndex: i + 1,
        roomId: undefined,
        notes: undefined,
      });
    }
  });

  return units;
}

// Pre-allocate some units for demo
export function getMockAllocationUnits(): AllocationUnit[] {
  const units = generateAllocationUnits(MOCK_BOQ_ITEMS);

  // Allocate some units to rooms
  const allocated = units.map((unit) => {
    // Allocate first few units of some items
    if (unit.boqItemId === "boq-001" && unit.unitIndex <= 3) {
      const roomIndex = (unit.unitIndex - 1) % 3;
      return { ...unit, roomId: MOCK_ROOMS[roomIndex].id };
    }
    if (unit.boqItemId === "boq-003" && unit.unitIndex <= 12) {
      const roomIndex = (unit.unitIndex - 1) % 6;
      return { ...unit, roomId: MOCK_ROOMS[roomIndex].id };
    }
    if (unit.boqItemId === "boq-007") {
      return { ...unit, roomId: "room-6" }; // AVR in Home Theater
    }
    return unit;
  });

  return allocated;
}
