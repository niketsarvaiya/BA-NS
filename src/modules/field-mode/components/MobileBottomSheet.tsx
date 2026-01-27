"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export function MobileBottomSheet({ open, onOpenChange, title, children }: MobileBottomSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div
        className="w-full max-w-md rounded-t-2xl bg-card shadow-xl border border-border border-b-0 px-4 pt-3 pb-4 animate-in slide-in-from-bottom-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="mx-auto h-1 w-10 rounded-full bg-muted" />
        </div>
        <div className={cn("flex items-center justify-between mb-2", !title && "hidden")}>
          <h2 className="text-sm font-medium text-foreground truncate">{title}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pb-1">{children}</div>
      </div>
    </div>
  );
}
