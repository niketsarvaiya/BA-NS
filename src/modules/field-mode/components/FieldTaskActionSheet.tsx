"use client";

import * as React from "react";
import { Camera, CheckCircle2, Flag, Link2, MessageCircle } from "lucide-react";
import type { FieldTask, FieldTaskFlagReason } from "../types";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FieldTaskActionSheetProps {
  open: boolean;
  task: FieldTask | null;
  onOpenChange: (open: boolean) => void;
  onComplete: (taskId: string, opts?: { withPhoto?: boolean; mediaIds?: string[] }) => void;
  onUploadPhoto: (taskId: string, mediaId: string) => void;
  onFlag: (taskId: string, reason: FieldTaskFlagReason, opts?: { note?: string; mediaIds?: string[] }) => void;
  onBlocked: (taskId: string, isBlocked: boolean, opts?: { reason?: string; dependencyTaskId?: string; note?: string }) => void;
  onAddNote: (taskId: string, note: string) => void;
}

const FLAG_REASON_OPTIONS: { id: FieldTaskFlagReason; label: string }[] = [
  { id: "MATERIAL_DAMAGED", label: "Material damaged" },
  { id: "MATERIAL_MISSING", label: "Material missing" },
  { id: "DEPENDENCY_PENDING", label: "Dependency pending" },
  { id: "DESIGN_CLARIFICATION", label: "Design clarification" },
  { id: "CLIENT_ACCESS_ISSUE", label: "Client access issue" },
];

export function FieldTaskActionSheet({
  open,
  task,
  onOpenChange,
  onComplete,
  onUploadPhoto,
  onFlag,
  onBlocked,
  onAddNote,
}: FieldTaskActionSheetProps) {
  const [flagReason, setFlagReason] = React.useState<FieldTaskFlagReason | null>(null);
  const [flagNote, setFlagNote] = React.useState("");
  const [blockReason, setBlockReason] = React.useState("");
  const [blockNote, setBlockNote] = React.useState("");
  const [noteText, setNoteText] = React.useState("");

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!open) {
      setFlagReason(null);
      setFlagNote("");
      setBlockReason("");
      setBlockNote("");
      setNoteText("");
    }
  }, [open]);

  if (!task) return null;

  function handlePhotoCapture(forCompletion?: boolean) {
    if (!fileInputRef.current || !task) return;
    const input = fileInputRef.current;
    const taskId = task.base.id;
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      const fakeId = `media-${Date.now()}`;
      // In this mock, we don't persist actual URLs; we just track IDs.
      if (forCompletion) {
        onComplete(taskId, { withPhoto: true, mediaIds: [fakeId] });
      } else {
        onUploadPhoto(taskId, fakeId);
      }
      target.value = "";
    };
    input.click();
  }

  return (
    <MobileBottomSheet open={open} onOpenChange={onOpenChange} title={task.base.title}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      <div className="space-y-4">
        {/* Primary actions */}
        <div className="space-y-2">
          <Button
            type="button"
            className="w-full justify-start gap-3 rounded-2xl h-11"
            onClick={() => onComplete(task.base.id)}
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>Mark Completed</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-3 rounded-2xl h-11"
            onClick={() => handlePhotoCapture(true)}
          >
            <Camera className="h-5 w-5" />
            <span>Complete with Photo</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-3 rounded-2xl h-11"
            onClick={() => handlePhotoCapture(false)}
          >
            <Camera className="h-5 w-5" />
            <span>Upload Photo</span>
          </Button>
        </div>

        {/* Flag Issue */}
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Flag className="h-3 w-3" /> Flag Issue
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FLAG_REASON_OPTIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setFlagReason(r.id)}
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] ${
                  flagReason === r.id
                    ? "bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-900/40 dark:text-amber-100"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Textarea
            value={flagNote}
            onChange={(e) => setFlagNote(e.target.value)}
            placeholder="Optional note (never required)"
            className="mt-1 h-16 text-xs"
          />
          <Button
            type="button"
            size="sm"
            disabled={!flagReason}
            onClick={() => {
              if (!flagReason) return;
              onFlag(task.base.id, flagReason, { note: flagNote || undefined });
              setFlagReason(null);
              setFlagNote("");
            }}
            className="h-8 text-xs rounded-full"
          >
            Save Flag
          </Button>
        </div>

        {/* Blocked / Dependency */}
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Link2 className="h-3 w-3" /> Blocked / Dependency
          </p>
          <Textarea
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Why is this blocked? (optional)"
            className="mt-1 h-14 text-xs"
          />
          <Textarea
            value={blockNote}
            onChange={(e) => setBlockNote(e.target.value)}
            placeholder="Optional note"
            className="mt-1 h-14 text-xs"
          />
          <div className="flex gap-2 mt-1">
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs rounded-full"
              onClick={() => {
                onBlocked(task.base.id, true, {
                  reason: blockReason || undefined,
                  note: blockNote || undefined,
                });
              }}
            >
              Mark Blocked
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 text-xs rounded-full"
              onClick={() => {
                onBlocked(task.base.id, false, {});
                setBlockReason("");
                setBlockNote("");
              }}
            >
              Clear Blocked
            </Button>
          </div>
        </div>

        {/* Optional Note */}
        <div className="space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <MessageCircle className="h-3 w-3" /> Add Optional Note
          </p>
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Speak or type anything useful (optional)."
            className="mt-1 h-16 text-xs"
          />
          <Button
            type="button"
            size="sm"
            className="h-8 text-xs rounded-full"
            disabled={!noteText.trim()}
            onClick={() => {
              if (!noteText.trim()) return;
              onAddNote(task.base.id, noteText.trim());
              setNoteText("");
            }}
          >
            Save Note
          </Button>
        </div>
      </div>
    </MobileBottomSheet>
  );
}
