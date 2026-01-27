"use client";

import { useState, useMemo } from "react";
import { Wrench, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { RoleBasedTask } from "../types/role-tasks";
import { CollapsibleTaskGroup } from "./CollapsibleTaskGroup";
import { RoleTaskDetailPanel } from "./RoleTaskDetailPanel";
import {
  MOCK_INSTALLER_TASKS,
  MOCK_TASK_ROOMS,
  groupTasksByRoom,
  calculateTaskStats,
} from "../utils/mockRoleTaskData";

interface InstallerTasksViewProps {
  projectId?: string;
}

export function InstallerTasksView({ projectId }: InstallerTasksViewProps) {
  const [tasks, setTasks] = useState<RoleBasedTask[]>(MOCK_INSTALLER_TASKS);
  const [selectedTask, setSelectedTask] = useState<RoleBasedTask | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tasks by search
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
    );
  }, [tasks, searchQuery]);

  // Group tasks
  const { roomGroups, generalGroup, hygieneGroup } = useMemo(() => {
    return groupTasksByRoom(filteredTasks);
  }, [filteredTasks]);

  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);

  const handleTaskUpdate = (
    taskId: string,
    updates: Partial<RoleBasedTask>
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    setSelectedTask(null);
  };

  const getRoomName = (roomId?: string) => {
    if (!roomId) return undefined;
    return MOCK_TASK_ROOMS.find((r) => r.id === roomId)?.name;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
            <Wrench className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
              Installer Tasks
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Installation tasks derived from BOQ
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Not Started" value={stats.notStarted} color="zinc" />
        <StatCard label="In Progress" value={stats.inProgress} color="blue" />
        <StatCard label="Blocked" value={stats.blocked} color="red" />
        <StatCard label="Done" value={stats.done} color="emerald" />
      </div>

      {/* Task Groups */}
      <div className="space-y-4">
        {/* Room Groups */}
        {roomGroups.map((group) => (
          <CollapsibleTaskGroup
            key={group.roomId}
            title={group.roomName}
            tasks={group.tasks}
            icon="room"
            onTaskClick={setSelectedTask}
          />
        ))}

        {/* General Tasks */}
        {generalGroup.tasks.length > 0 && (
          <CollapsibleTaskGroup
            title={generalGroup.name}
            tasks={generalGroup.tasks}
            icon="general"
            onTaskClick={setSelectedTask}
          />
        )}

        {/* Hygiene Tasks */}
        {hygieneGroup.tasks.length > 0 && (
          <CollapsibleTaskGroup
            title={hygieneGroup.name}
            tasks={hygieneGroup.tasks}
            icon="hygiene"
            onTaskClick={setSelectedTask}
          />
        )}

        {/* Empty State */}
        {roomGroups.length === 0 &&
          generalGroup.tasks.length === 0 &&
          hygieneGroup.tasks.length === 0 && (
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-12 text-center">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No installer tasks found
              </p>
            </div>
          )}
      </div>

      {/* Task Detail Panel */}
      {selectedTask && (
        <RoleTaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          roomName={getRoomName(selectedTask.roomId)}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "zinc",
}: {
  label: string;
  value: number;
  color?: "zinc" | "blue" | "red" | "emerald";
}) {
  const colorClasses = {
    zinc: "text-zinc-600 dark:text-zinc-400",
    blue: "text-blue-600 dark:text-blue-400",
    red: "text-red-600 dark:text-red-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className={`text-2xl font-semibold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
}
