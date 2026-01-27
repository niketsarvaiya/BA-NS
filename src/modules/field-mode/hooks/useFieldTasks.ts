"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { FIELD_SITES, getInitialFieldTasks } from "../mockData";
import type {
  FieldSite,
  FieldTask,
  FieldTaskActionEvent,
  FieldTaskActionType,
  FieldTaskFlagReason,
} from "../types";

function createEventId() {
  return `evt-${Math.random().toString(36).slice(2, 10)}`;
}

export function useFieldTasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState<FieldTask[]>(() => getInitialFieldTasks());
  const [events, setEvents] = useState<FieldTaskActionEvent[]>([]);

  const sites: FieldSite[] = useMemo(() => FIELD_SITES, []);

  function logEvent(params: {
    taskId: string;
    siteId: string;
    actionType: FieldTaskActionType;
    metadata?: Record<string, any>;
    mediaIds?: string[];
  }) {
    if (!user) return;
    const event: FieldTaskActionEvent = {
      id: createEventId(),
      taskId: params.taskId,
      siteId: params.siteId,
      userId: user.id,
      userRole: user.role,
      timestamp: new Date().toISOString(),
      actionType: params.actionType,
      metadata: params.metadata,
      mediaIds: params.mediaIds,
    };
    setEvents((prev) => [...prev, event]);
    setTasks((prev) =>
      prev.map((t) =>
        t.base.id === params.taskId
          ? {
              ...t,
              lastActionId: event.id,
            }
          : t,
      ),
    );
  }

  function updateTask(taskId: string, updater: (task: FieldTask) => FieldTask) {
    setTasks((prev) => prev.map((t) => (t.base.id === taskId ? updater(t) : t)));
  }

  function completeTask(taskId: string, opts?: { mediaIds?: string[] }) {
    updateTask(taskId, (task) => ({
      ...task,
      base: { ...task.base, status: "DONE" },
      photos: opts?.mediaIds ? [...task.photos, ...opts.mediaIds] : task.photos,
      block: { ...task.block, isBlocked: false },
    }));

    const task = tasks.find((t) => t.base.id === taskId);
    if (task) {
      logEvent({
        taskId,
        siteId: task.siteId,
        actionType: "TASK_COMPLETED",
        mediaIds: opts?.mediaIds,
      });
    }
  }

  function addPhoto(taskId: string, mediaId: string) {
    updateTask(taskId, (task) => ({
      ...task,
      photos: [...task.photos, mediaId],
    }));
    const task = tasks.find((t) => t.base.id === taskId);
    if (task) {
      logEvent({ taskId, siteId: task.siteId, actionType: "TASK_PHOTO_ADDED", mediaIds: [mediaId] });
    }
  }

  function flagTask(taskId: string, reason: FieldTaskFlagReason, opts?: { note?: string; mediaIds?: string[] }) {
    updateTask(taskId, (task) => ({
      ...task,
      flag: {
        isFlagged: true,
        reason,
        note: opts?.note,
        mediaIds: opts?.mediaIds,
      },
      photos: opts?.mediaIds ? [...task.photos, ...opts.mediaIds] : task.photos,
    }));
    const task = tasks.find((t) => t.base.id === taskId);
    if (task) {
      logEvent({
        taskId,
        siteId: task.siteId,
        actionType: "TASK_FLAGGED",
        mediaIds: opts?.mediaIds,
        metadata: { reason, note: opts?.note },
      });
    }
  }

  function setBlocked(taskId: string, isBlocked: boolean, opts?: { reason?: string; dependencyTaskId?: string; note?: string }) {
    updateTask(taskId, (task) => ({
      ...task,
      block: {
        isBlocked,
        reason: opts?.reason,
        dependencyTaskId: opts?.dependencyTaskId,
        note: opts?.note,
      },
    }));
    const task = tasks.find((t) => t.base.id === taskId);
    if (task) {
      logEvent({
        taskId,
        siteId: task.siteId,
        actionType: isBlocked ? "TASK_BLOCKED" : "TASK_UNBLOCKED",
        metadata: opts,
      });
    }
  }

  function addNote(taskId: string, note: string) {
    const task = tasks.find((t) => t.base.id === taskId);
    if (!task) return;
    logEvent({ taskId, siteId: task.siteId, actionType: "TASK_NOTE_ADDED", metadata: { note } });
  }

  function getTasksForSite(siteId: string): FieldTask[] {
    return tasks.filter((t) => t.siteId === siteId);
  }

  function getLastEventForTask(taskId: string): FieldTaskActionEvent | undefined {
    const list = events.filter((e) => e.taskId === taskId);
    return list[list.length - 1];
  }

  return {
    sites,
    tasks,
    events,
    getTasksForSite,
    getLastEventForTask,
    completeTask,
    addPhoto,
    flagTask,
    setBlocked,
    addNote,
  };
}
