"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { DoorOpen, ArrowLeft, ListChecks } from "lucide-react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { useFieldTasks } from "@/modules/field-mode/hooks/useFieldTasks";
import { FieldTaskActionSheet } from "@/modules/field-mode/components/FieldTaskActionSheet";
import type { FieldTask } from "@/modules/field-mode/types";
import { MOCK_BOQ_ITEMS, MOCK_ROOMS, getMockAllocationUnits } from "@/modules/projects/utils/mockBOQData";
import type { Room, BOQItem, AllocationUnit } from "@/modules/projects/types/boq";
import { cn } from "@/lib/utils";

function getRoleStakeholders(role?: string): string[] {
  switch (role) {
    case "technician":
      return ["ELECTRICIAN", "INSTALLER"];
    case "programmer":
      return ["PROGRAMMER"];
    case "qc":
      return ["QC"];
    default:
      return [];
  }
}

export default function ProjectFieldPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { user } = useAuth();
  const fieldCtx = useFieldTasks();

  const [activeRoomId, setActiveRoomId] = React.useState<string | null>(null);
  const [activeItemId, setActiveItemId] = React.useState<string | null>(null);
  const [activeTask, setActiveTask] = React.useState<FieldTask | null>(null);

  const rooms: Room[] = MOCK_ROOMS;
  const boqItems: BOQItem[] = MOCK_BOQ_ITEMS;
  const allocationUnits: AllocationUnit[] = React.useMemo(
    () => getMockAllocationUnits(),
    []
  );

  const itemsByRoom = React.useMemo(() => {
    const map = new Map<string, string[]>();
    allocationUnits.forEach((unit) => {
      if (!unit.roomId) return;
      const list = map.get(unit.roomId) ?? [];
      if (!list.includes(unit.boqItemId)) list.push(unit.boqItemId);
      map.set(unit.roomId, list);
    });
    return map;
  }, [allocationUnits]);

  const boqById = React.useMemo(() => {
    const dict: Record<string, BOQItem> = {};
    boqItems.forEach((b) => {
      dict[b.id] = b;
    });
    return dict;
  }, [boqItems]);

  const activeRoom = activeRoomId
    ? rooms.find((r) => r.id === activeRoomId) ?? null
    : null;

  const activeItem = activeItemId ? boqById[activeItemId] ?? null : null;

  const roleStakeholders = React.useMemo(
    () => getRoleStakeholders(user?.role),
    [user?.role]
  );

  const itemTasks: FieldTask[] = React.useMemo(() => {
    if (!activeItem || !roleStakeholders.length) return [];
    return fieldCtx.tasks.filter((t) => {
      const matchesRole = roleStakeholders.includes(t.base.stakeholder as string);
      const matchesItem = t.base.title.includes(activeItem.name);
      return matchesRole && matchesItem;
    });
  }, [fieldCtx.tasks, roleStakeholders, activeItem]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        {activeRoom || activeItem ? (
          <button
            type="button"
            onClick={() => {
              if (activeItem) {
                setActiveItemId(null);
                return;
              }
              setActiveRoomId(null);
            }}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : null}
        <div className="flex-1 min-w-0">
          <h1 className="text-page-title text-foreground truncate">
            Field – {projectId}
          </h1>
          <p className="mt-1 text-body text-muted-foreground">
            Select room, pick an item, then close or flag quickly.
          </p>
        </div>
      </div>

      {/* Step 1: choose room */}
      {!activeRoom && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">
            1. Select Room
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => {
              const itemIds = itemsByRoom.get(room.id) ?? [];
              if (itemIds.length === 0) return null; // hide empty rooms for field team
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setActiveRoomId(room.id)}
                  className="rounded-2xl border border-border bg-card px-4 py-4 text-left shadow-sm hover:border-primary/40 hover:shadow-md transition-smooth flex items-start gap-3"
                >
                  <div className="mt-1 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <DoorOpen className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {room.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {itemIds.length} item{itemIds.length > 1 ? "s" : ""} to work on
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: choose item in room */}
      {activeRoom && !activeItem && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">
            2. {activeRoom.name} – Select Item
          </p>
          <div className="space-y-2">
            {(itemsByRoom.get(activeRoom.id) ?? []).map((itemId) => {
              const item = boqById[itemId];
              if (!item) return null;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItemId(item.id)}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-sm hover:border-primary/40 hover:shadow-md transition-smooth flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Qty {item.qty} • {item.category}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    <ListChecks className="h-3 w-3" />
                    Tasks
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: tasks for this item (list) */}
      {activeRoom && activeItem && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground">
            3. {activeRoom.name} – {activeItem.name}
          </p>
          <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
            {!user && (
              <p className="text-sm text-muted-foreground">
                Sign in to see tasks for your role.
              </p>
            )}
            {user && itemTasks.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No tasks mapped to your role for this item.
              </p>
            )}
            {user && itemTasks.length > 0 && (
              <div className="space-y-2">
                {itemTasks.map((task) => (
                  <button
                    key={task.base.id}
                    type="button"
                    onClick={() => setActiveTask(task)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left hover:border-primary/40 hover:shadow-sm transition-smooth"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {task.base.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {task.base.status === "DONE" ? "Completed" : "Open"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {task.flag?.isFlagged && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 px-2 py-0.5 text-[10px]">
                          Flagged
                        </span>
                      )}
                      {task.block?.isBlocked && (
                        <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 px-2 py-0.5 text-[10px]">
                          Blocked
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom-sheet task actions for a single task */}
      <FieldTaskActionSheet
        open={!!activeTask}
        task={activeTask}
        onOpenChange={(open) => {
          if (!open) setActiveTask(null);
        }}
        onComplete={(taskId, opts) => {
          fieldCtx.completeTask(taskId, { mediaIds: opts?.mediaIds });
        }}
        onUploadPhoto={(taskId, mediaId) => {
          fieldCtx.addPhoto(taskId, mediaId);
        }}
        onFlag={(taskId, reason, opts) => {
          fieldCtx.flagTask(taskId, reason, {
            note: opts?.note,
            mediaIds: opts?.mediaIds,
          });
        }}
        onBlocked={(taskId, isBlocked, opts) => {
          fieldCtx.setBlocked(taskId, isBlocked, opts);
        }}
        onAddNote={(taskId, note) => {
          fieldCtx.addNote(taskId, note);
        }}
      />
    </div>
  );
}
