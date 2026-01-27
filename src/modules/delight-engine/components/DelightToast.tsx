"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DelightToastData, DelightEventType } from "../types";
import { getEventIcon, getEventAccentColor } from "../utils/eventHelpers";

interface DelightToastProps {
  data: DelightToastData;
  onDismiss: (id: string) => void;
}

export function DelightToast({ data, onDismiss }: DelightToastProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const Icon = getEventIcon(data.iconName || data.type);
  const accentColor = getEventAccentColor(data.type);

  const handleDismiss = React.useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(data.id);
    }, 300);
  }, [data.id, onDismiss]);

  React.useEffect(() => {
    // Fade in
    setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss
    const duration = data.duration ?? 5000;
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [data.id, handleDismiss]);

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full max-w-sm items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-lg transition-all duration-300 dark:bg-zinc-950",
        "border-zinc-200 dark:border-zinc-800",
        isVisible && !isExiting
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md",
          accentColor.bg
        )}
      >
        <Icon className={cn("h-4 w-4", accentColor.icon)} />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-50">
          {data.title}
        </p>
        {data.description && (
          <p className="text-xs leading-snug text-zinc-600 dark:text-zinc-400">
            {data.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex h-5 w-5 items-center justify-center rounded-sm text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface DelightToastContainerProps {
  toasts: DelightToastData[];
  onDismiss: (id: string) => void;
}

export function DelightToastContainer({ toasts, onDismiss }: DelightToastContainerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <DelightToast key={toast.id} data={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
}
