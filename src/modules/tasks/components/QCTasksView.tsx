"use client";

import { useState, useMemo } from "react";
import { ShieldCheck, Search, ListChecks, FileText, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { RoleBasedTask } from "../types/role-tasks";
import { CollapsibleTaskGroup } from "./CollapsibleTaskGroup";
import { RoleTaskDetailPanel } from "./RoleTaskDetailPanel";
import { QCDocumentsTab } from "@/modules/projects/components/qc/QCDocumentsTab";
import { QCSnagsTab } from "@/modules/projects/components/qc/QCSnagsTab";
import { getMockQCDocuments, getMockSnags } from "@/modules/projects/utils/mockQCData";
import type { QCDocument, Snag } from "@/modules/projects/types";
import {
  MOCK_QC_TASKS,
  MOCK_TASK_ROOMS,
  groupTasksByRoom,
  calculateTaskStats,
} from "../utils/mockRoleTaskData";

interface QCTasksViewProps {
  projectId?: string;
}

export function QCTasksView({ projectId }: QCTasksViewProps) {
  const [tasks, setTasks] = useState<RoleBasedTask[]>(MOCK_QC_TASKS);
  const [selectedTask, setSelectedTask] = useState<RoleBasedTask | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [documents] = useState<QCDocument[]>(() =>
    getMockQCDocuments(projectId ?? "proj-002")
  );
  const [snags, setSnags] = useState<Snag[]>(() =>
    getMockSnags(projectId ?? "proj-002")
  );

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

  const handleSnagUpdate = (snagId: string, patch: Partial<Snag>) => {
    setSnags((current) =>
      current.map((snag) => (snag.id === snagId ? { ...snag, ...patch } : snag))
    );
  };

  // Calculate snag stats for display
  const snagStats = useMemo(() => {
    const open = snags.filter((s) => s.status === "OPEN" || s.status === "IN_PROGRESS").length;
    const resolved = snags.filter((s) => s.status === "RESOLVED" || s.status === "CLOSED").length;
    return { open, resolved, total: snags.length };
  }, [snags]);

  // Calculate QC-specific stats
  const qcStats = useMemo(() => {
    const passed = tasks.filter((t) => t.status === "DONE").length;
    const failed = tasks.filter((t) => t.status === "BLOCKED").length;
    const pending = tasks.filter(
      (t) => t.status === "NOT_STARTED" || t.status === "IN_PROGRESS"
    ).length;

    return { passed, failed, pending };
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
              QC Tasks
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Quality control checks derived from BOQ
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

      {/* Tabs for Tasks and Documents */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg">
          <TabsTrigger
            value="tasks"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm text-sm px-4 py-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span>Tasks</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="snags"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm text-sm px-4 py-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Snag List</span>
              {snagStats.open > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-semibold text-white">
                  {snagStats.open}
                </span>
              )}
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm text-sm px-4 py-2 rounded-md"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4 space-y-4">
          {/* QC Summary Card */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Passed: <span className="font-semibold text-emerald-600">{qcStats.passed}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Failed: <span className="font-semibold text-red-600">{qcStats.failed}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Pending: <span className="font-semibold">{qcStats.pending}</span>
                  </span>
                </div>
              </div>
              
              {/* Progress */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  Progress
                </span>
                <div className="w-32 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{
                      width: `${stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}%
                </span>
              </div>
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
                    No QC tasks found
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
        </TabsContent>

        <TabsContent value="snags" className="mt-4">
          <QCSnagsTab snags={snags} onUpdateSnag={handleSnagUpdate} />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <QCDocumentsTab documents={documents} />
        </TabsContent>
      </Tabs>
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
