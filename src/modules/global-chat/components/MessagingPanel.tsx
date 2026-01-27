"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageCircle,
  Plus,
  ChevronLeft,
  MoreHorizontal,
  Paperclip,
  Send,
} from "lucide-react";

import { useGlobalChat } from "../context/GlobalChatContext";
import type { ChatConversation, ChatMessage } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function formatTimeShort(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MessageGroup {
  senderId: string;
  messages: ChatMessage[];
}

function buildMessageGroups(conversation: ChatConversation | null): MessageGroup[] {
  if (!conversation) return [];

  const groups: MessageGroup[] = [];

  for (const message of conversation.messages) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.senderId === message.senderId) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ senderId: message.senderId, messages: [message] });
    }
  }

  return groups;
}

export function MessagingPanel() {
  const {
    chats,
    isPanelOpen,
    activeConversation,
    activeConversationId,
    openConversation,
    backToList,
    closePanel,
    sendMessage,
  } = useGlobalChat();

  const [searchTerm, setSearchTerm] = useState("");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const inConversationView = !!activeConversation;

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeConversation?.messages.length]);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return chats;

    return chats.filter((chat) => {
      const name = chat.projectName?.toLowerCase() ?? "";
      const lastMessage = chat.messages[chat.messages.length - 1];
      const preview = lastMessage?.text.toLowerCase() ?? "";
      return name.includes(term) || preview.includes(term);
    });
  }, [chats, searchTerm]);

  const groups = useMemo(
    () => buildMessageGroups(activeConversation ?? null),
    [activeConversation]
  );

  const handleSend = () => {
    if (!activeConversationId || !draft.trim()) return;
    sendMessage(activeConversationId, draft.trim());
    setDraft("");
  };

  const handleDraftKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  if (!isPanelOpen) {
    return null;
  }

  const renderHeader = () => {
    if (!inConversationView || !activeConversation) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Messaging
              </p>
              <button
                type="button"
                onClick={closePanel}
                className="hidden rounded-full px-2 py-1 text-[11px] text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 sm:inline-flex"
              >
                Close
              </button>
            </div>
            <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500">
              Project chats and direct messages
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            aria-label="New message (mock)"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    const firstMessage = activeConversation.messages[0];
    const participants = activeConversation.participants;

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={backToList}
          className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          aria-label="Back to conversations"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {activeConversation.projectName}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-400 dark:text-zinc-500">
            <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              #project-chat
            </span>
            {firstMessage && (
              <span>{formatTimeShort(firstMessage.createdAt)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            {participants.slice(0, 3).map((person) => (
              <div
                key={person.id}
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-[10px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                {getInitials(person.name)}
              </div>
            ))}
          </div>
          {participants.length > 3 && (
            <span className="ml-1 text-[10px] text-zinc-400 dark:text-zinc-500">
              +{participants.length - 3}
            </span>
          )}
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            aria-label="Conversation options (mock)"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  };

  const renderConversationList = () => {
    if (!filteredConversations.length) {
      return (
        <div className="flex h-full items-center justify-center px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          No conversations match this search.
        </div>
      );
    }

    return (
      <div className="divide-y divide-zinc-100 text-sm dark:divide-zinc-900">
        {filteredConversations.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const preview = lastMessage?.text ?? "No messages yet";
          const isActive = activeConversationId === chat.id;

          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => openConversation(chat.id)}
              className={cn(
                "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors",
                isActive
                  ? "bg-zinc-50 dark:bg-zinc-900/70"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              )}
            >
              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900/90 text-[11px] font-semibold text-zinc-50 dark:bg-zinc-800">
                {getInitials(chat.projectName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="flex-1 truncate text-[13px] font-medium text-zinc-900 dark:text-zinc-50">
                    {chat.projectName}
                  </p>
                  {lastMessage && (
                    <span className="whitespace-nowrap text-[10px] text-zinc-400 dark:text-zinc-500">
                      {formatTimeShort(lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                  {preview}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500">
                  <span>#project-chat</span>
                  {chat.unreadCount > 0 && (
                    <span className="inline-flex min-w-[16px] items-center justify-center rounded-full bg-emerald-500/90 px-1.5 text-[10px] font-semibold text-white">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  const renderConversationBody = () => {
    if (!activeConversation) {
      return null;
    }

    const selfId = activeConversation.participants[0]?.id;

    return (
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto px-3 py-3 space-y-3 text-xs text-zinc-800 dark:text-zinc-50"
      >
        {groups.map((group) => {
          const sender = activeConversation.participants.find(
            (p) => p.id === group.senderId
          );
          const isSelf = sender?.id === selfId;
          const firstMessage = group.messages[0];

          return (
            <div key={group.messages[0].id} className="flex flex-col gap-1">
              <div
                className={cn(
                  "flex items-baseline gap-2 text-[11px] text-zinc-500 dark:text-zinc-400",
                  isSelf ? "justify-end" : "justify-start"
                )}
              >
                {!isSelf && (
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">
                    {sender?.name ?? "Unknown"}
                  </span>
                )}
                <span>{formatTimeShort(firstMessage.createdAt)}</span>
              </div>

              <div
                className={cn(
                  "flex w-full",
                  isSelf ? "justify-end" : "justify-start"
                )}
              >
                <div className="flex max-w-[80%] flex-col gap-1">
                  {group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "rounded-2xl px-3 py-1.5 text-[12px] leading-snug",
                        isSelf
                          ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-900"
                          : "bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-zinc-900/70 dark:text-zinc-50 dark:border-zinc-800/80"
                      )}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const placeholderText = activeConversation
    ? `Message #project-chat`
    : "Select a conversation to start messaging";

  return (
    <aside className="fixed top-14 bottom-0 right-0 z-40 flex w-full max-w-sm flex-col border-l border-zinc-200 bg-white/95 text-xs text-zinc-800 shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-100">
      <div className="border-b border-zinc-200/80 bg-zinc-50/95 px-3 py-2.5 dark:border-zinc-800/80 dark:bg-zinc-950/95">
        {renderHeader()}
        {!inConversationView && (
          <div className="mt-2 flex items-center gap-2">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search messages"
              className="h-8 text-xs"
            />
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden bg-white dark:bg-zinc-950">
        {!inConversationView && renderConversationList()}
        {inConversationView && renderConversationBody()}
      </div>

      {inConversationView && (
        <div className="border-t border-zinc-200/80 bg-zinc-50/95 px-2.5 py-2 dark:border-zinc-800/80 dark:bg-zinc-950/95">
          <div className="flex items-end gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
              aria-label="Attach file (mock)"
            >
              <Paperclip className="h-3.5 w-3.5" />
            </button>

            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleDraftKeyDown}
              rows={1}
              placeholder={placeholderText}
              className="max-h-24 min-h-[32px] resize-none rounded-md border-zinc-300 bg-white text-xs shadow-sm focus-visible:ring-1 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
            />

            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-1 px-1 text-[10px] text-zinc-400 dark:text-zinc-500">
            Press Enter to send, Shift+Enter for new line.
          </div>
        </div>
      )}
    </aside>
  );
}
