"use client";

import * as React from "react";
import { useFieldTasks } from "@/modules/field-mode/hooks/useFieldTasks";
import { FieldSitesView } from "@/modules/field-mode/components/FieldSitesView";
import { FieldSiteTasksView } from "@/modules/field-mode/components/FieldSiteTasksView";
import { FieldTaskActionSheet } from "@/modules/field-mode/components/FieldTaskActionSheet";

export default function FieldPage() {
  const {
    sites,
    tasks,
    getTasksForSite,
    completeTask,
    addPhoto,
    flagTask,
    setBlocked,
    addNote,
  } = useFieldTasks();

  const [activeSiteId, setActiveSiteId] = React.useState<string | null>(sites[0]?.siteId ?? null);
  const [activeTaskId, setActiveTaskId] = React.useState<string | null>(null);

  const activeSite = sites.find((s) => s.siteId === activeSiteId) ?? null;
  const siteTasks = activeSite ? getTasksForSite(activeSite.siteId) : tasks;
  const activeTask = activeTaskId
    ? siteTasks.find((t) => t.base.id === activeTaskId) ?? null
    : null;

  return (
    <>
      {!activeSite && (
        <FieldSitesView
          sites={sites}
          tasks={tasks}
          onSelectSite={(siteId) => setActiveSiteId(siteId)}
        />
      )}

      {activeSite && (
        <FieldSiteTasksView
          siteName={activeSite.name}
          tasks={siteTasks}
          onBack={() => setActiveSiteId(null)}
          onTaskAction={(task) => setActiveTaskId(task.base.id)}
        />
      )}

      <FieldTaskActionSheet
        open={!!activeTask}
        task={activeTask}
        onOpenChange={(open) => {
          if (!open) setActiveTaskId(null);
        }}
        onComplete={(taskId, opts) => {
          completeTask(taskId, { mediaIds: opts?.mediaIds });
        }}
        onUploadPhoto={(taskId, mediaId) => {
          addPhoto(taskId, mediaId);
        }}
        onFlag={(taskId, reason, opts) => {
          flagTask(taskId, reason, { note: opts?.note, mediaIds: opts?.mediaIds });
        }}
        onBlocked={(taskId, isBlocked, opts) => {
          setBlocked(taskId, isBlocked, opts);
        }}
        onAddNote={(taskId, note) => {
          addNote(taskId, note);
        }}
      />
    </>
  );
}
