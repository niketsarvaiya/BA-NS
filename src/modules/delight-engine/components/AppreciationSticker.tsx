"use client";

import * as React from "react";
import { Heart, ThumbsUp, Handshake, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppreciationSticker as AppreciationStickerType, StickerVariant } from "../types";
import { formatRelativeTime } from "../utils/eventHelpers";

interface AppreciationStickerProps {
  sticker: AppreciationStickerType;
  /** If true, show full details; otherwise show compact version */
  expanded?: boolean;
  onClick?: () => void;
}

const STICKER_VARIANTS: Record<
  StickerVariant,
  {
    icon: typeof Heart;
    label: string;
    bg: string;
    iconColor: string;
  }
> = {
  thanks: {
    icon: Heart,
    label: "Thanks",
    bg: "bg-zinc-100 dark:bg-zinc-900/30",
    iconColor: "text-zinc-700 dark:text-zinc-400",
  },
  great_work: {
    icon: ThumbsUp,
    label: "Great Work",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-700 dark:text-emerald-400",
  },
  helpful: {
    icon: Handshake,
    label: "Helpful",
    bg: "bg-sky-100 dark:bg-sky-900/30",
    iconColor: "text-sky-700 dark:text-sky-400",
  },
  collaboration: {
    icon: Users,
    label: "Great Collaboration",
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-700 dark:text-indigo-400",
  },
};

export function AppreciationSticker({
  sticker,
  expanded = false,
  onClick,
}: AppreciationStickerProps) {
  const variant = STICKER_VARIANTS[sticker.variant];
  const Icon = variant.icon;

  if (expanded) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border px-4 py-3",
          "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/80"
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", variant.bg)}>
            <Icon className={cn("h-5 w-5", variant.iconColor)} />
          </div>
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {sticker.fromUserName}
              </p>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                {formatRelativeTime(sticker.timestamp)}
              </span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">{variant.label}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {sticker.message}
        </p>
        {sticker.context && (
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            Context: {sticker.context}
          </p>
        )}
      </div>
    );
  }

  // Compact version
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left transition-colors",
        "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:border-zinc-700",
        !sticker.seen && "ring-1 ring-zinc-900/5 dark:ring-zinc-50/5"
      )}
    >
      <div className={cn("flex h-6 w-6 items-center justify-center rounded", variant.bg)}>
        <Icon className={cn("h-3 w-3", variant.iconColor)} />
      </div>
      <div className="flex-1 space-y-0.5 min-w-0">
        <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50 truncate">
          {sticker.fromUserName}
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{variant.label}</p>
      </div>
      {!sticker.seen && (
        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-500" />
      )}
    </button>
  );
}

interface AppreciationStickerListProps {
  stickers: AppreciationStickerType[];
  maxVisible?: number;
}

export function AppreciationStickerList({
  stickers,
  maxVisible = 5,
}: AppreciationStickerListProps) {
  const [selectedSticker, setSelectedSticker] = React.useState<AppreciationStickerType | null>(
    null
  );

  const visibleStickers = stickers.slice(0, maxVisible);
  const remainingCount = stickers.length - maxVisible;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {visibleStickers.map((sticker) => (
          <AppreciationSticker
            key={sticker.id}
            sticker={sticker}
            expanded={selectedSticker?.id === sticker.id}
            onClick={() =>
              setSelectedSticker(selectedSticker?.id === sticker.id ? null : sticker)
            }
          />
        ))}
      </div>
      {remainingCount > 0 && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          +{remainingCount} more appreciation{remainingCount === 1 ? "" : "s"}
        </p>
      )}
    </div>
  );
}
