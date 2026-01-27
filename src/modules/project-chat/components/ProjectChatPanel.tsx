"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Hash,
  MoreHorizontal,
  Reply,
  SmilePlus,
  Paperclip,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProjectById } from "@/modules/projects/utils/mockData";
import type { ProjectChatMessage } from "../types";
import { getMockProjectChatMessages } from "../utils/mockProjectChatData";
import { useProjectChat } from "../context/ProjectChatContext";

// BACKEND NOTE:
// Important chat messages may later be promoted to Activities
// via user action or system rules.

// BACKEND NOTE:
// Chat is ephemeral; Activity is audit-grade.

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderMessageText(text: string) {
  const parts = text.split(/(\@[a-zA-Z0-9_]+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      return (
        <span
          key={index}
          className="font-medium text-primary bg-primary/10 px-0.5 rounded"
        >
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function AvatarCircle({ name }: { name: string }) {
  const initials = useMemo(() => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  }, [name]);

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-[11px] font-semibold text-zinc-50 dark:bg-zinc-800">
      {initials}
    </div>
  );
}

export function ProjectChatPanel() {
  const { isCollapsed, toggleCollapsed, isMobileOpen, closeMobile } =
    useProjectChat();
  const params = useParams();
  const projectId = (params.projectId as string) ?? null;
  const project = projectId ? getProjectById(projectId) : null;
  const [messages, setMessages] = useState<ProjectChatMessage[]>(() =>
    projectId ? getMockProjectChatMessages(projectId) : []
  );
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const uniqueSenders = useMemo(
    () =>
      Array.from(
        new Map(
          messages
            .filter((m) => !m.isSystem)
            .map((m) => [m.sender.userId, m.sender])
        ).values()
      ).slice(0, 4),
    [messages]
  );

  const handleSend = () => {
    if (!draft.trim() || !projectId) return;

    const newMessage: ProjectChatMessage = {
      id: `local-${Date.now()}`,
      projectId,
      sender: {
        userId: "current-user",
        name: "You",
        role: "Field Staff",
      },
      message: draft.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, newMessage]);
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

  const header = (
    <div className="flex items-center justify-between gap-2 border-b border-zinc-800/70 bg-zinc-950/90 px-2.5 py-2 text-xs text-zinc-300 dark:border-zinc-800/70 dark:bg-zinc-950/90">
      {isCollapsed ? (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="inline-flex items-center gap-2 rounded-md px-1.5 py-1 text-[11px] text-zinc-400 hover:bg-zinc-900/80 hover:text-zinc-100"
          aria-label="Expand project chat"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-50">
            <Hash className="h-3.5 w-3.5" />
            {messages.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                {messages.length}
              </span>
            )}
          </div>
          <span className="pr-0.5">Chat</span>
        </button>
      ) : (
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Hash className="h-3.5 w-3.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              <span className="truncate max-w-[180px]">
                {project?.name ?? "Project chat"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
              <span>#project-chat</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div className="flex -space-x-1">
              {uniqueSenders.map((sender) => (
                <div
                  key={sender.userId}
                  className="inline-flex rounded-full border border-zinc-800/60 bg-zinc-900/90 p-[1px] dark:border-zinc-700"
                >
                  <AvatarCircle name={sender.name} />
                </div>
              ))}
            </div>
            {messages.length > 0 && (
              <span className="ml-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                +{Math.max(messages.length - uniqueSenders.length, 0)}
              </span>
            )}
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 dark:text-zinc-500 dark:hover:bg-zinc-900"
              aria-label="Pin message (UI only)"
            >
              <Paperclip className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 dark:text-zinc-500 dark:hover:bg-zinc-900"
              aria-label="Search in chat (UI only)"
            >
              <span className="text-[10px]">⌘F</span>
            </button>
          </div>
          <button
            type="button"
            onClick={toggleCollapsed}
            className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-200 dark:text-zinc-500 dark:hover:bg-zinc-900"
            aria-label="Collapse project chat"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );

  const body = (
    <div className="flex min-h-0 flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Start the conversation for this project.
        </div>
      ) : (
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full px-3 py-3">
            <div className="space-y-3">
              {messages.map((message, index) => {
                const previous = messages[index - 1];
                const isSameSenderAsPrevious =
                  !!previous &&
                  !message.isSystem &&
                  !previous.isSystem &&
                  previous.sender.userId === message.sender.userId;

                if (message.isSystem) {
                  return (
                    <div
                      key={message.id}
                      className="flex justify-center text-[11px] text-zinc-400 dark:text-zinc-500"
                    >
                      <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-900/70">
                        <span>{message.message}</span>
                        <span className="text-[10px] opacity-70">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={message.id} className="flex gap-2">
                    {!isSameSenderAsPrevious ? (
                      <div className="mt-0.5">
                        <AvatarCircle name={message.sender.name} />
                      </div>
                    ) : (
                      <div className="w-8" />
                    )}

                    <div className="flex-1 min-w-0">
                      {!isSameSenderAsPrevious && (
                        <div className="flex items-baseline gap-1 text-xs">
                          <span className="font-medium text-zinc-900 dark:text-zinc-50">
                            {message.sender.name}
                          </span>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                            {message.sender.role}
                          </span>
                          <span className="ml-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      )}

                      <div className="group relative mt-0.5 inline-flex max-w-full flex-col gap-1 rounded-lg bg-white px-3 py-1.5 text-xs text-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900/90 dark:text-zinc-50 dark:ring-zinc-800/80">
                        <div className="whitespace-pre-wrap break-words text-[13px] leading-snug">
                          {renderMessageText(message.message)}
                        </div>

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {message.attachments.map((attachment) => (
                              <button
                                key={attachment.name}
                                type="button"
                                className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                              >
                                <Paperclip className="h-3 w-3" />
                                <span className="max-w-[140px] truncate">
                                  {attachment.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="pointer-events-none absolute -right-1 -top-2 hidden gap-1 text-[11px] text-zinc-400 group-hover:flex">
                          <button
                            type="button"
                            className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-zinc-900/95 px-2 py-0.5 text-[11px] text-zinc-100 shadow-sm dark:bg-zinc-800"
                          >
                            <Reply className="h-3 w-3" />
                            Reply
                          </button>
                          <button
                            type="button"
                            className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/95 text-zinc-100 shadow-sm dark:bg-zinc-800"
                            aria-label="Add reaction"
                          >
                            <SmilePlus className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900/95 text-zinc-100 shadow-sm dark:bg-zinc-800"
                            aria-label="More actions"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="border-t border-zinc-200 bg-zinc-50 px-2 py-2.5 text-xs dark:border-zinc-800/70 dark:bg-zinc-950/80">
        <div className="flex items-end gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-zinc-300 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 dark:border-zinc-700 dark:text-zinc-500 dark:hover:border-zinc-500 dark:hover:text-zinc-200"
            aria-label="Attach file (UI only)"
          >
            <Paperclip className="h-3.5 w-3.5" />
          </button>

          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Message #project-chat"
            className="max-h-24 min-h-[36px] resize-none rounded-md border-zinc-300 bg-white text-xs shadow-sm focus-visible:ring-1 focus-visible:ring-primary dark:border-zinc-700 dark:bg-zinc-900"
          />

          <Button
            size="sm"
            onClick={handleSend}
            className="h-8 flex-shrink-0 px-3 text-xs"
          >
            Send
          </Button>
        </div>
        <div className="mt-1 px-1 text-[10px] text-zinc-400 dark:text-zinc-500">
          Press Enter to send, Shift+Enter for new line.
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed right-side panel */}
      <aside
        className={cn(
          "hidden lg:flex flex-col rounded-lg border border-zinc-800/70 bg-zinc-950/90 shadow-none transition-all duration-200",
          isCollapsed ? "w-[56px]" : "w-[320px]"
        )}
      >
        {header}
        {!isCollapsed && body}
      </aside>

      {/* Mobile slide-over drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex items-stretch justify-end lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobile}
          />
          <div className="relative z-50 flex h-full w-full max-w-md flex-col border-l border-zinc-800/70 bg-zinc-50 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs dark:border-zinc-800/70 dark:bg-zinc-950/80">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                  <Hash className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    <span className="truncate max-w-[160px]">
                      {project?.name ?? "Project chat"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500">
                    <span>#project-chat</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={closeMobile}
                className="h-7 px-2 text-[11px]"
              >
                Close
              </Button>
            </div>

            {body}
          </div>
        </div>
      )}
    </>
  );
}
