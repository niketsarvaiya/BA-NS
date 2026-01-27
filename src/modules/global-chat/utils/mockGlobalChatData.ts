import type { ChatConversation, ChatMessage } from "../types";

function isoMinutesAgo(minutes: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
}

function makeMessages(chatId: string, base: { senderId: string; text: string; minutesAgo: number }[]): ChatMessage[] {
  return base.map((m, index) => ({
    id: `${chatId}-m${index + 1}`,
    chatId,
    senderId: m.senderId,
    text: m.text,
    createdAt: isoMinutesAgo(m.minutesAgo),
  }));
}

export const MOCK_GLOBAL_CHATS: ChatConversation[] = [
  {
    id: "chat-proj-001",
    projectId: "proj-001",
    projectName: "Skyline Tower Upgrade",
    participants: [
      { id: "u1", name: "Amit Patel", role: "Supervisor" },
      { id: "u2", name: "Rakesh Kumar", role: "Electrician" },
      { id: "u3", name: "Priya Shah", role: "PM" },
    ],
    messages: makeMessages("chat-proj-001", [
      {
        senderId: "u1",
        text: "Team, civil is cleared for Living + Dining. We can start rough-in tomorrow.",
        minutesAgo: 45,
      },
      {
        senderId: "u2",
        text: "Noted. I will pull the crew from Tower B after lunch.",
        minutesAgo: 40,
      },
      {
        senderId: "u3",
        text: "Please share a quick photo update once conduits are in.",
        minutesAgo: 30,
      },
    ]),
    unreadCount: 2,
  },
  {
    id: "chat-proj-002",
    projectId: "proj-002",
    projectName: "Greenfield Residential Phase A",
    participants: [
      { id: "u4", name: "Priya Sharma", role: "Supervisor" },
      { id: "u5", name: "QC Lead", role: "QC" },
    ],
    messages: makeMessages("chat-proj-002", [
      {
        senderId: "u4",
        text: "Client wants dimming in all bedrooms at 40% by default after 9 PM.",
        minutesAgo: 90,
      },
      {
        senderId: "u5",
        text: "We will need an extra test pass once programming is updated.",
        minutesAgo: 80,
      },
    ]),
    unreadCount: 1,
  },
  {
    id: "chat-proj-003",
    projectId: "proj-003",
    projectName: "Northbridge Hub",
    participants: [
      { id: "u6", name: "Ops Bot", role: "System" },
      { id: "u7", name: "Meera Iyer", role: "Supervisor" },
    ],
    messages: makeMessages("chat-proj-003", [
      {
        senderId: "u6",
        text: "3 tasks were completed in the last 24 hours.",
        minutesAgo: 240,
      },
      {
        senderId: "u7",
        text: "Good. Let's keep the same velocity on the rack room this week.",
        minutesAgo: 230,
      },
    ]),
    unreadCount: 0,
  },
];
