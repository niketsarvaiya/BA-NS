import type { Note } from "../types";

// FRONTEND-ONLY MOCK DATA
// Backend will eventually source notes from a real API.

const now = new Date();

function isoDate(daysOffset: number = 0): string {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

function isoDateTime(hours: number, minutes: number): string {
  const d = new Date(now);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

export const MOCK_NOTES: Note[] = [
  {
    id: "note-001",
    projectId: "proj-001",
    projectName: "Skyline Tower Upgrade",
    noteDate: isoDate(0),
    createdAt: isoDateTime(10, 15),
    authorName: "Amit Patel",
    subject: "Kickoff with client on lighting scope",
    type: "MOM",
    body:
      "Discussed initial expectations on lighting scenes, keypad locations, and handover timelines.",
    momFields: {
      meetingWith: "Skyline Properties (Client)",
      attendees: ["Amit Patel", "Client PM", "Designer"],
      keyDiscussionPoints:
        "Client wants simple scenes with fewer buttons, and clear ownership on site handovers.",
      decisionsTaken:
        "Freeze keypad positions this week. Designer to share updated reflected ceiling plan.",
      actionItems: [
        "Amit to confirm final keypad locations by Friday",
        "Designer to send updated RCP drawings",
      ],
    },
  },
  {
    id: "note-002",
    projectId: "proj-001",
    projectName: "Skyline Tower Upgrade",
    noteDate: isoDate(0),
    createdAt: isoDateTime(9, 30),
    authorName: "Ravi Sharma",
    subject: "Status on living room keypad installation",
    type: "TASK_UPDATE",
    body: "Keypads installed in living and dining, testing pending for dimmers.",
    taskUpdateFields: {
      relatedTaskId: "task-001",
      relatedTaskLabel: "Install living room keypads",
      updateType: "PROGRESS",
      updateDetails:
        "All back boxes fixed, 6 keypads installed. Waiting for store to issue last batch.",
    },
  },
  {
    id: "note-003",
    projectId: "proj-002",
    projectName: "Greenfield Residential Phase A",
    noteDate: isoDate(-1),
    createdAt: isoDateTime(16, 45),
    authorName: "Priya Sharma",
    subject: "Client feedback on bedroom dimming levels",
    type: "CLIENT_NOTE",
    body:
      "Client prefers softer lighting after 9 PM in bedrooms. Wants default scene at ~40%.",
    clientNoteFields: {
      clientName: "Greenfield Developers",
      sentiment: "POSITIVE",
      followUpRequired: true,
    },
  },
  {
    id: "note-004",
    projectId: "proj-003",
    projectName: "Northbridge Hub",
    noteDate: isoDate(-2),
    createdAt: isoDateTime(11, 5),
    authorName: "Amit Patel",
    subject: "Programming sequence for rack bring-up",
    type: "INTERNAL_NOTE",
    body:
      "Documenting the order for powering up AV + network racks to avoid nuisance trips.",
    internalNoteFields: {
      visibility: "PROJECT_TEAM",
      internalContext:
        "Only share with core project team. Can later be converted to a runbook.",
    },
  },
  {
    id: "note-005",
    projectId: "proj-001",
    projectName: "Skyline Tower Upgrade",
    noteDate: isoDate(-5),
    createdAt: isoDateTime(15, 20),
    authorName: "Amit Patel",
    subject: "Client prefers dimmers to default at 70% for living room",
    type: "GENERAL_NOTE",
    body:
      "When we program scenes, ensure living room dimmers do not start at full brightness.",
  },
];
