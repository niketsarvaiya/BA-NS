import type { ProjectChatMessage } from "../types";

const BASE_MESSAGES: Omit<ProjectChatMessage, "projectId">[] = [
  {
    id: "m1",
    sender: {
      userId: "u1",
      name: "Rakesh Kumar",
      role: "Site Supervisor",
    },
    message: "Morning team, blocking for civil work in Tower B is done.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "m2",
    sender: {
      userId: "u2",
      name: "Anjali Singh",
      role: "Project Engineer",
    },
    message:
      "Great. Let's move @Rakesh to electrical rough-in for core 3 after lunch.",
    mentions: ["u1"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "m3",
    sender: {
      userId: "u3",
      name: "Operations Bot",
      role: "System",
    },
    message: "Task 'Core 3 civil check' completed by Rakesh.",
    createdAt: new Date().toISOString(),
    isSystem: true,
  },
  {
    id: "m4",
    sender: {
      userId: "u1",
      name: "Rakesh Kumar",
      role: "Site Supervisor",
    },
    message:
      "Sharing latest BOQ break-up for HVAC. Please review before tomorrow's client call.",
    attachments: [
      {
        name: "HVAC_BOQ_Core3_v2.xlsx",
        url: "#",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "m5",
    sender: {
      userId: "u4",
      name: "Meera Patel",
      role: "Quality Lead",
    },
    message:
      "Heads up: QC visit scheduled for Friday 4 PM. @Anjali please make sure site is ready.",
    mentions: ["u2"],
    createdAt: new Date().toISOString(),
  },
];

export function getMockProjectChatMessages(
  projectId: string
): ProjectChatMessage[] {
  // For now we just project-id-scope the base messages.
  // BACKEND NOTE:
  // Replace with project-specific chat history fetched from API.
  return BASE_MESSAGES.map((msg) => ({ ...msg, projectId }));
}
