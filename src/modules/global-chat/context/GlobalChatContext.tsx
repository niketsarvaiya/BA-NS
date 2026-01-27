"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { ChatConversation, OpenChatWindow } from "../types";
import { MOCK_GLOBAL_CHATS } from "../utils/mockGlobalChatData";

interface GlobalChatContextValue {
  // Data
  chats: ChatConversation[];
  totalUnread: number;

  // Legacy bar + window state (no longer used in new UX, but kept for compatibility)
  barCollapsed: boolean;
  openWindows: OpenChatWindow[];
  toggleBar: () => void;
  openChat: (chatId: string) => void;
  closeChat: (chatId: string) => void;
  minimizeChat: (chatId: string) => void;
  restoreChat: (chatId: string) => void;

  // New messaging panel state
  isPanelOpen: boolean;
  activeConversationId: string | null;
  activeConversation: ChatConversation | null;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  openConversation: (chatId: string) => void;
  backToList: () => void;

  // Messaging actions
  sendMessage: (chatId: string, text: string) => void;
}

const GlobalChatContext = createContext<GlobalChatContextValue | undefined>(
  undefined
);

export function GlobalChatProvider({ children }: { children: React.ReactNode }) {
  // Core chat data
  const [chats, setChats] = useState<ChatConversation[]>(() => MOCK_GLOBAL_CHATS);

  // Legacy bar + windows state (kept for compatibility, unused in new UX)
  const [barCollapsed, setBarCollapsed] = useState(true);
  const [openWindows, setOpenWindows] = useState<OpenChatWindow[]>([]);

  // Messaging panel state
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null
  );

  const totalUnread = useMemo(
    () => chats.reduce((sum, chat) => sum + chat.unreadCount, 0),
    [chats]
  );

  const activeConversation = useMemo(
    () => chats.find((chat) => chat.id === activeConversationId) ?? null,
    [chats, activeConversationId]
  );

  // Legacy bar toggling (no longer drives main UX)
  const toggleBar = useCallback(() => {
    setBarCollapsed((prev) => !prev);
  }, []);

  // Messaging panel controls
  const openPanel = useCallback(() => {
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
    setActiveConversationId(null);
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelOpen((prev) => {
      if (prev) {
        // When closing panel, reset selection back to the conversation list
        setActiveConversationId(null);
      }
      return !prev;
    });
  }, []);

  const openConversation = useCallback((chatId: string) => {
    setIsPanelOpen(true);
    setActiveConversationId(chatId);

    // Mark chat as read when opened in the panel
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
  }, []);

  // Back to conversation list within the panel
  const backToList = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  // Legacy openChat API now delegates to panel-based conversations
  const openChat = useCallback(
    (chatId: string) => {
      openConversation(chatId);
    },
    [openConversation]
  );

  const closeChat = useCallback((chatId: string) => {
    // For legacy window-based API, simply clear any matching open window
    setOpenWindows((prev) => prev.filter((w) => w.chatId !== chatId));
  }, []);

  const minimizeChat = useCallback((chatId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.chatId === chatId ? { ...w, minimized: true } : w
      )
    );
  }, []);

  const restoreChat = useCallback((chatId: string) => {
    setOpenWindows((prev) =>
      prev.map((w) =>
        w.chatId === chatId ? { ...w, minimized: false } : w
      )
    );
  }, []);

  const sendMessage = useCallback((chatId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date().toISOString();

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== chatId) return chat;
        const newMessageId = `local-${Date.now()}`;
        const selfSenderId = chat.participants[0]?.id ?? "me";
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: newMessageId,
              chatId,
              senderId: selfSenderId,
              text: text.trim(),
              createdAt: now,
            },
          ],
        };
      })
    );
  }, []);

  const value: GlobalChatContextValue = {
    // Data
    chats,
    totalUnread,

    // Legacy bar + windows (kept for compatibility)
    barCollapsed,
    openWindows,
    toggleBar,
    openChat,
    closeChat,
    minimizeChat,
    restoreChat,

    // Messaging panel state
    isPanelOpen,
    activeConversationId,
    activeConversation,
    openPanel,
    closePanel,
    togglePanel,
    openConversation,
    backToList,

    // Actions
    sendMessage,
  };

  return (
    <GlobalChatContext.Provider value={value}>
      {children}
    </GlobalChatContext.Provider>
  );
}

export function useGlobalChat(): GlobalChatContextValue {
  const ctx = useContext(GlobalChatContext);
  if (!ctx) {
    throw new Error("useGlobalChat must be used within a GlobalChatProvider");
  }
  return ctx;
}
