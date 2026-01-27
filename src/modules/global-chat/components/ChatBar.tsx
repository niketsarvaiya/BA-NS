"use client";

import { MessageCircle, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { useGlobalChat } from "../context/GlobalChatContext";
import { cn } from "@/lib/utils";

export function ChatBar() {
  const { chats, barCollapsed, toggleBar, openChat, totalUnread } = useGlobalChat();

  const unread = totalUnread;

  if (barCollapsed) {
    return (
      <button
        type="button"
        onClick={toggleBar}
        className="fixed right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-600 shadow-sm hover:bg-white hover:text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-zinc-300"
        aria-label="Open chat bar"
      >
        <div className="relative">
          <MessageCircle className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold text-white">
              {unread}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <aside className="fixed right-4 top-20 bottom-6 z-30 flex w-64 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 text-xs text-zinc-800 shadow-lg backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95 dark:text-zinc-100">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <MessageCircle className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium text-zinc-800 dark:text-zinc-50">
              Project chats
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
              Optional, always on the side
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleBar}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          aria-label="Collapse chat bar"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const preview = lastMessage ? lastMessage.text : "No messages yet";

          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => openChat(chat.id)}
              className="w-full rounded-xl px-2.5 py-2 text-left hover:bg-zinc-50 border border-transparent hover:border-zinc-200 flex items-start gap-2 dark:hover:bg-zinc-900/70 dark:hover:border-zinc-800"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                {chat.projectName
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-[12px] font-medium text-zinc-900 dark:text-zinc-50">
                    {chat.projectName}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="ml-1 inline-flex min-w-[16px] items-center justify-center rounded-full bg-emerald-500/90 px-1 text-[10px] font-semibold text-white">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {preview}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[9px] text-zinc-400 dark:text-zinc-500">
                  <Circle className={cn("h-2 w-2", "text-emerald-400")} />
                  <span>Site crew</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
