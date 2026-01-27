import type { SiteBOQItem, StatusHistoryEntry } from "../types/siteBOQ";

// BACKEND NOTE:
// This mock data will be replaced with API calls to /api/projects/[id]/site-boq
// Status values are derived from task completion + activity logs

export const MOCK_SITE_BOQ_ITEMS: SiteBOQItem[] = [
  // Fully completed items - with per-unit tracking
  {
    id: "site-boq-001",
    projectId: "proj-001",
    itemName: "Keypad 4 Button",
    description: "Lutron Seetouch",
    quantity: 8,
    status: {
      ordered: true,
      assigned: true,
      delivered: true,
      installed: true,
      programmed: true,
      qced: true,
    },
    units: [
      {
        unitId: "unit-001-1",
        unitNumber: 1,
        roomId: "room-1",
        roomName: "Living Room",
        status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: true },
        lastUpdatedAt: "2026-01-27T14:30:00Z",
        lastUpdatedBy: "Manoj Verma",
      },
      {
        unitId: "unit-001-2",
        unitNumber: 2,
        roomId: "room-1",
        roomName: "Living Room",
        status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: true },
        lastUpdatedAt: "2026-01-27T14:30:00Z",
        lastUpdatedBy: "Manoj Verma",
      },
      {
        unitId: "unit-001-3",
        unitNumber: 3,
        roomId: "room-2",
        roomName: "Master Bedroom",
        status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: true },
        lastUpdatedAt: "2026-01-27T14:30:00Z",
        lastUpdatedBy: "Manoj Verma",
      },
      {
        unitId: "unit-001-4",
        unitNumber: 4,
        roomId: "room-2",
        roomName: "Master Bedroom",
        status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: true },
        lastUpdatedAt: "2026-01-27T14:30:00Z",
        lastUpdatedBy: "Manoj Verma",
      },
      {
        unitId: "unit-001-5",
        unitNumber: 5,
        roomId: "room-3",
        roomName: "Kitchen",
        status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: true },
        lastUpdatedAt: "2026-01-27T14:30:00Z",
        lastUpdatedBy: "Manoj Verma",
      },
      {
        unitId: "unit-001-6",
        unitNumber: 6,
        roomId: "room-4",
        roomName: "Guest Bedroom",
        status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: true },
        lastUpdatedAt: "2026-01-27T14:30:00Z",
        lastUpdatedBy: "Manoj Verma",
      },
      {
        unitId: "unit-001-7",
        unitNumber: 7,
        roomId: "room-5",
        roomName: "Study Room",
        status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: true },
        lastUpdatedAt: "2026-01-27T14:30:00Z",
        lastUpdatedBy: "Manoj Verma",
      },
      {
        unitId: "unit-001-8",
        unitNumber: 8,
        roomId: "room-6",
        roomName: "Home Theater",
        status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: true },
        lastUpdatedAt: "2026-01-27T14:30:00Z",
        lastUpdatedBy: "Manoj Verma",
      },
    ],
    lastUpdatedAt: "2026-01-27T14:30:00Z",
    lastUpdatedBy: "Manoj Verma",
  },

  // In progress - installed but not programmed
  {
    id: "site-boq-002",
    projectId: "proj-001",
    itemName: "Touch Panel 7 inch",
    description: "Crestron TSW-770",
    quantity: 3,
    status: {
      ordered: true,
      assigned: true,
      delivered: true,
      installed: true,
      programmed: false,
      qced: false,
    },
    lastUpdatedAt: "2026-01-26T16:45:00Z",
    lastUpdatedBy: "Ravi Sharma",
  },

  // Delivered but partially installed - with per-unit tracking showing mixed status
  {
    id: "site-boq-003",
    projectId: "proj-001",
    itemName: "DALI Dimmable Light",
    description: "Philips 12W",
    quantity: 24,
    status: {
      ordered: true,
      assigned: true,
      delivered: true,
      installed: false, // Some installed, some not
      programmed: false,
      qced: false,
    },
    units: [
      // Living Room - 6 units (installed & programmed)
      { unitId: "unit-003-1", unitNumber: 1, roomId: "room-1", roomName: "Living Room", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: false }, lastUpdatedAt: "2026-01-26T10:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      { unitId: "unit-003-2", unitNumber: 2, roomId: "room-1", roomName: "Living Room", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: false }, lastUpdatedAt: "2026-01-26T10:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      { unitId: "unit-003-3", unitNumber: 3, roomId: "room-1", roomName: "Living Room", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: false }, lastUpdatedAt: "2026-01-26T10:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      { unitId: "unit-003-4", unitNumber: 4, roomId: "room-1", roomName: "Living Room", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: false }, lastUpdatedAt: "2026-01-26T10:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      { unitId: "unit-003-5", unitNumber: 5, roomId: "room-1", roomName: "Living Room", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: false }, lastUpdatedAt: "2026-01-26T10:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      { unitId: "unit-003-6", unitNumber: 6, roomId: "room-1", roomName: "Living Room", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: true, qced: false }, lastUpdatedAt: "2026-01-26T10:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      // Master Bedroom - 4 units (installed, not programmed)
      { unitId: "unit-003-7", unitNumber: 7, roomId: "room-2", roomName: "Master Bedroom", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: false, qced: false }, lastUpdatedAt: "2026-01-25T15:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      { unitId: "unit-003-8", unitNumber: 8, roomId: "room-2", roomName: "Master Bedroom", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: false, qced: false }, lastUpdatedAt: "2026-01-25T15:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      { unitId: "unit-003-9", unitNumber: 9, roomId: "room-2", roomName: "Master Bedroom", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: false, qced: false }, lastUpdatedAt: "2026-01-25T15:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      { unitId: "unit-003-10", unitNumber: 10, roomId: "room-2", roomName: "Master Bedroom", status: { ordered: true, assigned: true, delivered: true, installed: true, programmed: false, qced: false }, lastUpdatedAt: "2026-01-25T15:00:00Z", lastUpdatedBy: "Rakesh Kumar" },
      // Kitchen - 3 units (delivered, not installed)
      { unitId: "unit-003-11", unitNumber: 11, roomId: "room-3", roomName: "Kitchen", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-12", unitNumber: 12, roomId: "room-3", roomName: "Kitchen", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-13", unitNumber: 13, roomId: "room-3", roomName: "Kitchen", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      // Guest Bedroom - 3 units (delivered, not installed)
      { unitId: "unit-003-14", unitNumber: 14, roomId: "room-4", roomName: "Guest Bedroom", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-15", unitNumber: 15, roomId: "room-4", roomName: "Guest Bedroom", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-16", unitNumber: 16, roomId: "room-4", roomName: "Guest Bedroom", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      // Study Room - 4 units (delivered, not installed)
      { unitId: "unit-003-17", unitNumber: 17, roomId: "room-5", roomName: "Study Room", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-18", unitNumber: 18, roomId: "room-5", roomName: "Study Room", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-19", unitNumber: 19, roomId: "room-5", roomName: "Study Room", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-20", unitNumber: 20, roomId: "room-5", roomName: "Study Room", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      // Home Theater - 4 units (delivered, not installed)
      { unitId: "unit-003-21", unitNumber: 21, roomId: "room-6", roomName: "Home Theater", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-22", unitNumber: 22, roomId: "room-6", roomName: "Home Theater", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-23", unitNumber: 23, roomId: "room-6", roomName: "Home Theater", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
      { unitId: "unit-003-24", unitNumber: 24, roomId: "room-6", roomName: "Home Theater", status: { ordered: true, assigned: true, delivered: true, installed: false, programmed: false, qced: false }, lastUpdatedAt: "2026-01-22T09:30:00Z", lastUpdatedBy: "Store Team" },
    ],
    lastUpdatedAt: "2026-01-22T09:30:00Z",
    lastUpdatedBy: "Store Team",
  },

  // Ordered but not delivered
  {
    id: "site-boq-004",
    projectId: "proj-001",
    itemName: "Phasecut Dimmer",
    description: "Lutron DVCL-153P",
    quantity: 12,
    status: {
      ordered: true,
      assigned: true,
      delivered: false,
      installed: false,
      programmed: false,
      qced: false,
    },
    lastUpdatedAt: "2026-01-20T11:00:00Z",
    lastUpdatedBy: "Store Team",
  },

  // Not yet ordered
  {
    id: "site-boq-005",
    projectId: "proj-001",
    itemName: "Motorized Curtain Track",
    description: "Somfy Glydea 60",
    quantity: 4,
    status: {
      ordered: false,
      assigned: false,
      delivered: false,
      installed: false,
      programmed: false,
      qced: false,
    },
    lastUpdatedAt: "2026-01-15T10:00:00Z",
    lastUpdatedBy: "Neha Gupta",
  },

  // Completed
  {
    id: "site-boq-006",
    projectId: "proj-001",
    itemName: "Motion Sensor PIR",
    description: "Lutron LOS-CDT",
    quantity: 6,
    status: {
      ordered: true,
      assigned: true,
      delivered: true,
      installed: true,
      programmed: true,
      qced: true,
    },
    lastUpdatedAt: "2026-01-25T13:20:00Z",
    lastUpdatedBy: "Manoj Verma",
  },

  // Installed, awaiting programming
  {
    id: "site-boq-007",
    projectId: "proj-001",
    itemName: "Ceiling Speaker",
    description: "Bose DS40F",
    quantity: 10,
    status: {
      ordered: true,
      assigned: true,
      delivered: true,
      installed: true,
      programmed: false,
      qced: false,
    },
    lastUpdatedAt: "2026-01-24T17:15:00Z",
    lastUpdatedBy: "Ravi Sharma",
  },

  // Projector - long throw
  {
    id: "site-boq-008",
    projectId: "proj-001",
    itemName: "Projector Long Throw",
    description: "Sony VPL-VW915ES",
    quantity: 1,
    status: {
      ordered: true,
      assigned: true,
      delivered: true,
      installed: true,
      programmed: true,
      qced: false,
    },
    lastUpdatedAt: "2026-01-23T17:00:00Z",
    lastUpdatedBy: "Deepak Joshi",
  },

  // IP Camera - delivered
  {
    id: "site-boq-009",
    projectId: "proj-001",
    itemName: "IP Camera 4MP",
    description: "Hikvision DS-2CD2143G0",
    quantity: 8,
    status: {
      ordered: true,
      assigned: true,
      delivered: true,
      installed: false,
      programmed: false,
      qced: false,
    },
    lastUpdatedAt: "2026-01-21T14:30:00Z",
    lastUpdatedBy: "Store Team",
  },

  // Network Switch
  {
    id: "site-boq-010",
    projectId: "proj-001",
    itemName: "Network Switch 24 Port",
    description: "Cisco SG350-24",
    quantity: 2,
    status: {
      ordered: true,
      assigned: true,
      delivered: true,
      installed: true,
      programmed: true,
      qced: true,
    },
    lastUpdatedAt: "2026-01-20T12:00:00Z",
    lastUpdatedBy: "Arjun Singh",
  },
];

// Mock status history
export const MOCK_STATUS_HISTORY: Record<string, StatusHistoryEntry[]> = {
  "site-boq-001": [
    {
      id: "hist-001",
      field: "qced",
      oldValue: false,
      newValue: true,
      updatedBy: "Manoj Verma",
      updatedAt: "2026-01-27T14:30:00Z",
      notes: "All keypads tested successfully",
    },
    {
      id: "hist-002",
      field: "programmed",
      oldValue: false,
      newValue: true,
      updatedBy: "Deepak Joshi",
      updatedAt: "2026-01-26T11:15:00Z",
      notes: "Scenes configured for all rooms",
    },
    {
      id: "hist-003",
      field: "installed",
      oldValue: false,
      newValue: true,
      updatedBy: "Rakesh Kumar",
      updatedAt: "2026-01-25T16:20:00Z",
    },
  ],
};
