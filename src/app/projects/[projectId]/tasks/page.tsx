"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskListView } from "@/modules/tasks/components/TaskListView";
import { TaskDetailPanel } from "@/modules/tasks/components/TaskDetailPanel";
import { generateTasksFromBOQ } from "@/modules/tasks/generators/generateTasksFromBOQ";
import { taskTemplates } from "@/modules/tasks/templates/taskTemplates";
import { MOCK_BOQ_ITEMS, MOCK_ROOMS } from "@/modules/projects/utils/mockBOQData";
import type { ProjectTask, TaskFilters, TaskStatus } from "@/modules/tasks/types";

// BACKEND NOTE:
// Replace taskTemplates import with API call to /api/task-templates
// Replace MOCK_BOQ_ITEMS with API call to /api/projects/[id]/boq
// Replace local tasks state with API calls to /api/projects/[id]/tasks

export default function TasksPage() {
  const projectId = "proj-001";

  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const generatedTasks = generateTasksFromBOQ({
      projectId,
      boqItems: MOCK_BOQ_ITEMS,
      rooms: MOCK_ROOMS,
      taskTemplates,
    });
    setTasks(generatedTasks);
  }, [projectId]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(search)) return false;
      }
      if (filters.stakeholder && task.stakeholder !== filters.stakeholder)
        return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      return true;
    });
  }, [tasks, filters]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      notStarted: tasks.filter((t) => t.status === "NOT_STARTED").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      blocked: tasks.filter((t) => t.status === "BLOCKED").length,
      done: tasks.filter((t) => t.status === "DONE").length,
    };
  }, [tasks]);

  const selectedTask = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId)
    : null;

  return (
    <>
      <div
        className={`w-full max-w-[1600px] mx-auto space-y-6 transition-all duration-300 ${
          selectedTask ? "mr-[800px]" : ""
        }`}
      >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
            Project Tasks
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Auto-generated from project scope
          </p>
        </div>
        <Button className="gap-2" disabled>
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total</p>
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {stats.total}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Not Started
            </p>
            <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-400">
              {stats.notStarted}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              In Progress
            </p>
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {stats.inProgress}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Blocked</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              {stats.blocked}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Done</p>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.done}
            </p>
          </div>
        </div>
      </div>

        <TaskListView
          tasks={filteredTasks}
          filters={filters}
          onFiltersChange={setFilters}
          onTaskClick={(task) => setSelectedTaskId(task.id)}
          getBOQItemName={(id) =>
            MOCK_BOQ_ITEMS.find((i) => i.id === id)?.name || id
          }
          getRoomName={(id) => MOCK_ROOMS.find((r) => r.id === id)?.name || id}
        />
      </div>

      {/* Task Detail Panel */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          getBOQItemName={(id) =>
            MOCK_BOQ_ITEMS.find((i) => i.id === id)?.name || id
          }
          getRoomName={(id) => MOCK_ROOMS.find((r) => r.id === id)?.name || id}
        />
      )}
    </>
  );
}
