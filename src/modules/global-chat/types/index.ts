export interface ChatParticipant {
  id: string;
  name: string;
  role?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO timestamp
}

export interface ChatConversation {
  id: string;
  projectId: string;
  projectName: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  unreadCount: number;
}

export interface OpenChatWindow {
  chatId: string;
  minimized: boolean;
}
