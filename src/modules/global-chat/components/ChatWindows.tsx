"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Minus, X, Paperclip, Send } from "lucide-react";
import { useGlobalChat } from "../context/GlobalChatContext";
import type { ChatConversation } from "../types";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function ChatWindow({ chat, index }: { chat: ChatConversation; index: number }) {
  const { closeChat, minimizeChat, sendMessage } = useGlobalChat();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat.messages.length]);

  const participantsLabel = useMemo(
    () => chat.participants.map((p) => p.name).join(", "),
    [chat.participants]
  );

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(chat.id, draft.trim());
    setDraft("");
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const rightOffset = 16 + index * 296;

  return (
    <div
      className="fixed bottom-3 z-40 flex h-72 w-72 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 text-xs text-zinc-800 shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-50"
      style={{ right: rightOffset }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200/80 bg-zinc-50/95 px-2.5 py-1.5 dark:border-zinc-800/80 dark:bg-zinc-950/95">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            {getInitials(chat.projectName)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="truncate text-[11px] font-medium text-zinc-900 dark:text-zinc-50">
              {chat.projectName}
            </span>
            <span className="truncate text-[10px] text-zinc-400 dark:text-zinc-500">
              {participantsLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => minimizeChat(chat.id)}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            aria-label="Minimize chat"
          >
            <Minus className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => closeChat(chat.id)}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
            aria-label="Close chat"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white/90 dark:bg-zinc-950/90">
        <div ref={scrollRef} className="h-full overflow-y-auto px-2.5 py-2 space-y-1.5">
          {chat.messages.map((message) => {
            const sender = chat.participants.find((p) => p.id === message.senderId);
            const isSelf = sender === chat.participants[0];
            return (
              <div
                key={message.id}
                className={cn("flex w-full", isSelf ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-2.5 py-1.5 text-[11px]",
                    isSelf
                      ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-900"
                      : "bg-zinc-100 text-zinc-900 border border-zinc-200 dark:bg-zinc-900/60 dark:text-zinc-50 dark:border-zinc-800/80"
                  )}
                  title={new Date(message.createdAt).toLocaleString("en-IN")}
                >
                  {!isSelf && (
                    <div className="mb-0.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                      {sender?.name ?? "Unknown"}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-snug">{message.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-zinc-200/80 bg-zinc-50/95 px-2 py-1.5 dark:border-zinc-800/80 dark:bg-zinc-950/95">
        <div className="flex items-end gap-1.5">
          <button
            type="button"
            className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
            aria-label="Attach file (mock)"
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message crew..."
            className="max-h-16 min-h-[28px] w-full resize-none rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-600"
          />
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mt-0.5 px-1 text-[9px] text-zinc-400 dark:text-zinc-600">
          Press Enter to send, Shift+Enter for new line.
        </div>
      </div>
    </div>
  );
}

export function ChatWindows() {
  const { chats, openWindows, restoreChat } = useGlobalChat();

  const openChats = useMemo(
    () =>
      openWindows
        .filter((w) => !w.minimized)
        .map((w) => chats.find((c) => c.id === w.chatId))
        .filter(Boolean) as ChatConversation[],
    [openWindows, chats]
  );

  const minimized = useMemo(
    () =>
      openWindows
        .filter((w) => w.minimized)
        .map((w) => chats.find((c) => c.id === w.chatId))
        .filter(Boolean) as ChatConversation[],
    [openWindows, chats]
  );

  return (
    <>
      {openChats.map((chat, index) => (
        <ChatWindow key={chat.id} chat={chat} index={index} />
      ))}

      {minimized.length > 0 && (
        <div className="fixed bottom-1 right-4 z-30 flex gap-2">
          {minimized.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => restoreChat(chat.id)}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-950/95 px-3 py-1 text-[11px] text-zinc-100 border border-zinc-800/80 hover:bg-zinc-900"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-semibold text-zinc-50">
                {getInitials(chat.projectName)}
              </span>
              <span className="max-w-[140px] truncate">{chat.projectName}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
