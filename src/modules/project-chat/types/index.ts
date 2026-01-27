export type ProjectChatMessage = {
  id: string;
  projectId: string;
  sender: {
    userId: string;
    name: string;
    role: string;
  };
  message: string;
  mentions?: string[]; // userIds
  attachments?: {
    name: string;
    url: string;
  }[];
  createdAt: string;
  isSystem?: boolean;
};
