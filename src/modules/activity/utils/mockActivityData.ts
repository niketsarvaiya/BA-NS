import type { ProjectActivity } from "../types";

// BACKEND NOTE:
// Activities are generated from system events + manual inputs.
// Timesheet entries, WhatsApp logs, and task events will map here.
// Visits, Calls, and Notes can be created manually.
// Task, Material, QC, and Status events are system-generated.

const now = new Date();
const today = (hours: number, minutes: number = 0) => {
  const d = new Date(now);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const daysAgo = (days: number, hours: number = 10, minutes: number = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const getDateString = (daysBack: number = 0): string => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysBack);
  return d.toISOString().split("T")[0];
};

export const MOCK_ACTIVITIES: ProjectActivity[] = [
  // ========== TODAY ==========
  
  // Supervisor Visit with MOM
  {
    id: "act-001",
    projectId: "proj-001",
    type: "VISIT",
    subType: "Supervisor Visit",
    title: "Site inspection and team coordination",
    description: "Regular site visit to check installation progress and coordinate with electricians.",
    actor: {
      userId: "user-001",
      name: "Amit Patel",
      role: "Site Supervisor",
    },
    date: getDateString(0),
    time: "14:30",
    durationMinutes: 120,
    momRequired: true,
    mom: `## Attendees
- Amit Patel (Site Supervisor)
- Rakesh Kumar (Electrician)
- Ravi Sharma (Installer)

## Discussion Points
1. Living Room keypad installation completed successfully
2. Master Bedroom dimmer modules need testing
3. Network cabling delayed by 2 days due to material availability

## Action Items
- Rakesh to complete testing by tomorrow EOD
- Store team to expedite Cat6 cable delivery
- Schedule QC check for completed rooms

## Issues
- Minor wall damage during installation - needs touch-up
- One keypad DOA, replacement requested`,
    issuesReported: [
      {
        description: "Wall damage during keypad installation in Living Room",
        severity: "LOW",
      },
      {
        description: "One keypad arrived DOA, replacement needed",
        severity: "MEDIUM",
      },
    ],
    attachments: [
      { name: "site_photos_27jan.jpg", url: "/mock/attachments/1" },
      { name: "wall_damage.jpg", url: "/mock/attachments/2" },
    ],
    createdAt: today(14, 30),
  },
  // Task Event
  {
    id: "act-002",
    projectId: "proj-001",
    type: "TASK_EVENT",
    subType: "Task Completed",
    title: "Install Living Room Keypads",
    description: "Installation of 4-button keypads in living room completed.",
    actor: {
      userId: "user-005",
      name: "Rakesh Kumar",
      role: "Electrician",
    },
    date: getDateString(0),
    time: "13:15",
    relatedTaskId: "task-boq-001-tpl-keypad-install",
    relatedRoomId: "room-1",
    createdAt: today(13, 15),
  },

  // QC Event
  {
    id: "act-003",
    projectId: "proj-001",
    type: "QC_EVENT",
    subType: "QC Check Passed",
    title: "QC check completed for Master Bedroom lighting",
    description: "All DALI dimmable lights tested and functioning properly.",
    actor: {
      userId: "user-010",
      name: "Manoj Verma",
      role: "QC",
    },
    date: getDateString(0),
    time: "12:15",
    relatedRoomId: "room-2",
    createdAt: today(12, 15),
  },

  // Material Event
  {
    id: "act-004",
    projectId: "proj-001",
    type: "MATERIAL_EVENT",
    subType: "Material Delivered",
    title: "Keypad 4 Button - 8 units",
    description: "Delivery of keypads from warehouse to site.",
    actor: {
      userId: "user-015",
      name: "Store Team",
      role: "Store",
    },
    date: getDateString(0),
    time: "10:00",
    relatedBOQItemId: "boq-001",
    createdAt: today(10, 0),
  },

  // ========== YESTERDAY ==========

  // Architect Call
  {
    id: "act-005",
    projectId: "proj-001",
    type: "CALL",
    subType: "Architect Call",
    title: "Discussion on ceiling design changes",
    description: "Conference call with architect regarding proposed changes to false ceiling in master bedroom.",
    actor: {
      userId: "user-003",
      name: "Neha Gupta",
      role: "Designer",
    },
    date: getDateString(1),
    time: "16:45",
    durationMinutes: 30,
    relatedRoomId: "room-2",
    createdAt: daysAgo(1, 16, 45),
  },

  // Task Event
  {
    id: "act-006",
    projectId: "proj-001",
    type: "TASK_EVENT",
    subType: "Task Assigned",
    title: "Program touch panel interface",
    description: "Touch panel programming task assigned to Deepak for home theater control.",
    actor: {
      userId: "user-001",
      name: "Amit Patel",
      role: "Site Supervisor",
    },
    date: getDateString(1),
    time: "15:20",
    relatedTaskId: "task-boq-002-tpl-touch-panel-program",
    createdAt: daysAgo(1, 15, 20),
  },

  // QC Event with issue
  {
    id: "act-007",
    projectId: "proj-001",
    type: "QC_EVENT",
    subType: "Snag Reported",
    title: "Projector alignment issue in Home Theater",
    description: "Projector not aligned properly with screen, requires adjustment.",
    actor: {
      userId: "user-010",
      name: "Manoj Verma",
      role: "QC",
    },
    date: getDateString(1),
    time: "14:10",
    relatedRoomId: "room-6",
    issuesReported: [
      {
        description: "Projector alignment off by approximately 15 degrees",
        severity: "MEDIUM",
      },
    ],
    createdAt: daysAgo(1, 14, 10),
  },

  // Material Event
  {
    id: "act-008",
    projectId: "proj-001",
    type: "MATERIAL_EVENT",
    subType: "Material Dispatched",
    title: "Touch Panel 7 inch - 3 units",
    description: "Touch panels dispatched from warehouse, expected delivery tomorrow.",
    actor: {
      userId: "user-015",
      name: "Store Team",
      role: "Store",
    },
    date: getDateString(1),
    time: "11:30",
    relatedBOQItemId: "boq-002",
    createdAt: daysAgo(1, 11, 30),
  },

  // ========== 2 DAYS AGO ==========

  // General Note
  {
    id: "act-009",
    projectId: "proj-001",
    type: "NOTE",
    subType: "General Note",
    title: "Client preference for dimmer levels",
    description: "Client wants living room dimmers to default to 70% instead of 100%. Update programming accordingly.",
    actor: {
      userId: "user-001",
      name: "Amit Patel",
      role: "Site Supervisor",
    },
    date: getDateString(2),
    time: "15:45",
    createdAt: daysAgo(2, 15, 45),
  },

  // Task Event
  {
    id: "act-010",
    projectId: "proj-001",
    type: "TASK_EVENT",
    subType: "Task Completed",
    title: "Install projector - Projector Long Throw",
    description: "Long throw projector installation completed in home theater.",
    actor: {
      userId: "user-008",
      name: "Ravi Sharma",
      role: "Installer",
    },
    date: getDateString(2),
    time: "17:00",
    relatedTaskId: "task-boq-008-tpl-projector-install",
    relatedRoomId: "room-6",
    createdAt: daysAgo(2, 17, 0),
  },

  // ========== 3 DAYS AGO ==========

  // Visit without MOM (Technician visit - MOM not required)
  {
    id: "act-011",
    projectId: "proj-001",
    type: "VISIT",
    subType: "Technician Visit",
    title: "Network setup and troubleshooting",
    description: "Network specialist visited to set up main rack and configure switches.",
    actor: {
      userId: "user-012",
      name: "Arjun Singh",
      role: "Network Technician",
    },
    date: getDateString(3),
    time: "14:00",
    durationMinutes: 180,
    momRequired: false,
    createdAt: daysAgo(3, 14, 0),
  },

  // Status Event
  {
    id: "act-012",
    projectId: "proj-001",
    type: "STATUS_EVENT",
    subType: "Phase Changed",
    title: "Project moved to Execution phase",
    description: "Design and planning completed, project now in execution phase.",
    actor: {
      userId: "user-001",
      name: "Amit Patel",
      role: "Site Supervisor",
    },
    date: getDateString(3),
    time: "10:00",
    createdAt: daysAgo(3, 10, 0),
  },

  // ========== 5 DAYS AGO ==========

  // Supervisor Visit with MOM PENDING
  {
    id: "act-013",
    projectId: "proj-001",
    type: "VISIT",
    subType: "Supervisor Visit",
    title: "Initial site assessment",
    description: "First supervisor visit after design approval, assessed site readiness.",
    actor: {
      userId: "user-001",
      name: "Amit Patel",
      role: "Site Supervisor",
    },
    date: getDateString(5),
    time: "11:00",
    durationMinutes: 90,
    momRequired: true,
    // mom field intentionally missing - this is a MOM PENDING case
    createdAt: daysAgo(5, 11, 0),
  },

  // Material Event
  {
    id: "act-014",
    projectId: "proj-001",
    type: "MATERIAL_EVENT",
    subType: "Material Delivered",
    title: "DALI Dimmable Light - 24 units",
    description: "First batch of DALI lights delivered to site.",
    actor: {
      userId: "user-015",
      name: "Store Team",
      role: "Store",
    },
    date: getDateString(5),
    time: "09:30",
    relatedBOQItemId: "boq-003",
    createdAt: daysAgo(5, 9, 30),
  },
];
