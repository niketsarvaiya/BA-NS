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
        className="fixed right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-muted-foreground shadow-sm hover:bg-card hover:text-foreground transition-smooth"
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
    <aside className="fixed right-4 top-20 bottom-6 z-30 flex w-64 flex-col overflow-hidden rounded-2xl border border-border bg-card/95 text-xs text-foreground shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-foreground">
            <MessageCircle className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium text-foreground">
              Project chats
            </span>
            <span className="text-[10px] text-muted-foreground">
              Optional, always on the side
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleBar}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth"
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
              className="w-full rounded-xl px-2.5 py-2 text-left hover:bg-muted border border-transparent hover:border-border flex items-start gap-2 transition-smooth"
            >
              <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                {chat.projectName
                  .split(" ")
                  .filter(Boolean)
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-[12px] font-medium text-foreground">
                    {chat.projectName}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="ml-1 inline-flex min-w-[16px] items-center justify-center rounded-full bg-emerald-500/90 px-1 text-[10px] font-semibold text-white">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                  {preview}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[9px] text-muted-foreground">
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
