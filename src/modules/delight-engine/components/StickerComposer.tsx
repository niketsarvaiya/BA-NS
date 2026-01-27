"use client";

import * as React from "react";
import { Heart, ThumbsUp, Handshake, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { StickerVariant } from "../types";

interface StickerComposerProps {
  /** Recipient user ID (optional, can be selected in composer) */
  recipientId?: string;
  /** Recipient name for display */
  recipientName?: string;
  /** Optional context like task or project ID */
  context?: string;
  /** Callback when sticker is submitted */
  onSubmit: (data: {
    recipientId: string;
    variant: StickerVariant;
    message: string;
    context?: string;
  }) => void;
  /** Callback when composer is cancelled */
  onCancel?: () => void;
}

const STICKER_VARIANTS: Array<{
  value: StickerVariant;
  label: string;
  icon: typeof Heart;
  bg: string;
  iconColor: string;
}> = [
  {
    value: "thanks",
    label: "Thanks",
    icon: Heart,
    bg: "bg-zinc-100 dark:bg-zinc-900/30",
    iconColor: "text-zinc-700 dark:text-zinc-400",
  },
  {
    value: "great_work",
    label: "Great Work",
    icon: ThumbsUp,
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-700 dark:text-emerald-400",
  },
  {
    value: "helpful",
    label: "Helpful",
    icon: Handshake,
    bg: "bg-sky-100 dark:bg-sky-900/30",
    iconColor: "text-sky-700 dark:text-sky-400",
  },
  {
    value: "collaboration",
    label: "Great Collaboration",
    icon: Users,
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-700 dark:text-indigo-400",
  },
];

export function StickerComposer({
  recipientId,
  recipientName,
  context,
  onSubmit,
  onCancel,
}: StickerComposerProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<StickerVariant | null>(null);
  const [message, setMessage] = React.useState("");
  const [internalRecipientId, setInternalRecipientId] = React.useState(recipientId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVariant || !message.trim() || !internalRecipientId) {
      return;
    }

    // TODO: Submit sticker via POST /api/delight/sticker
    onSubmit({
      recipientId: internalRecipientId,
      variant: selectedVariant,
      message: message.trim(),
      context,
    });

    // Reset form
    setSelectedVariant(null);
    setMessage("");
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Send Appreciation
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {recipientName
              ? `To ${recipientName}`
              : "Acknowledge a colleague's contribution"}
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-6 w-6 items-center justify-center rounded-sm text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Variant selection */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Choose recognition type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {STICKER_VARIANTS.map((variant) => {
              const Icon = variant.icon;
              const isSelected = selectedVariant === variant.value;
              return (
                <button
                  key={variant.value}
                  type="button"
                  onClick={() => setSelectedVariant(variant.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                    isSelected
                      ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-900"
                      : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:border-zinc-700"
                  )}
                >
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded", variant.bg)}>
                    <Icon className={cn("h-4 w-4", variant.iconColor)} />
                  </div>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                    {variant.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message input */}
        <div className="space-y-2">
          <label htmlFor="sticker-message" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Add a note
          </label>
          <textarea
            id="sticker-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a brief message..."
            rows={3}
            maxLength={200}
            className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
          />
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            {message.length}/200 characters
          </p>
        </div>

        {/* Recipient selector (if not pre-set) */}
        {!recipientId && (
          <div className="space-y-2">
            <label htmlFor="recipient-id" className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Recipient ID (placeholder)
            </label>
            <input
              id="recipient-id"
              type="text"
              value={internalRecipientId}
              onChange={(e) => setInternalRecipientId(e.target.value)}
              placeholder="user-123"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-700"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!selectedVariant || !message.trim() || !internalRecipientId}
            className="flex-1"
          >
            Send
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
        Frontend only. Backend integration pending.
      </p>
    </div>
  );
}
