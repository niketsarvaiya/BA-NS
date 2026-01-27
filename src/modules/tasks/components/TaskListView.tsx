import { Search, Calendar, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, StakeholderBadge, PriorityBadge } from "./TaskBadges";
import type { ProjectTask, TaskFilters } from "../types";
import { cn } from "@/lib/utils";

interface TaskListViewProps {
  tasks: ProjectTask[];
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onTaskClick: (task: ProjectTask) => void;
  getBOQItemName?: (boqItemId: string) => string;
  getRoomName?: (roomId: string) => string;
}

export function TaskListView({
  tasks,
  filters,
  onFiltersChange,
  onTaskClick,
  getBOQItemName,
  getRoomName,
}: TaskListViewProps) {
  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search tasks..."
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="pl-9"
            />
          </div>
        </div>

        <Select
          value={filters.stakeholder || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              stakeholder: value === "all" ? undefined : (value as any),
            })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Stakeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stakeholders</SelectItem>
            <SelectItem value="SITE_SUPERVISOR">Supervisor</SelectItem>
            <SelectItem value="ELECTRICIAN">Electrician</SelectItem>
            <SelectItem value="INSTALLER">Installer</SelectItem>
            <SelectItem value="PROGRAMMER">Programmer</SelectItem>
            <SelectItem value="CARPENTER">Carpenter</SelectItem>
            <SelectItem value="QC">QC</SelectItem>
            <SelectItem value="CLIENT">Client</SelectItem>
            <SelectItem value="DESIGNER">Designer</SelectItem>
            <SelectItem value="STORE">Store</SelectItem>
            <SelectItem value="THIRD_PARTY">3rd Party</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === "all" ? undefined : (value as any),
            })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="NOT_STARTED">Not Started</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="BLOCKED">Blocked</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.priority || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              priority: value === "all" ? undefined : (value as any),
            })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className={cn(
              "p-4 rounded-lg border transition-all cursor-pointer group",
              "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70",
              "hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title and Status */}
                <div className="flex items-start gap-2">
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-50 flex-1">
                    {task.title}
                  </h4>
                  <StatusBadge status={task.status} />
                </div>

                {/* Metadata Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <StakeholderBadge stakeholder={task.stakeholder} />
                  <PriorityBadge priority={task.priority} />

                  {task.boqItemId && getBOQItemName && (
                    <Badge variant="outline" className="text-xs">
                      {getBOQItemName(task.boqItemId)}
                    </Badge>
                  )}

                  {task.roomId && getRoomName && (
                    <Badge variant="muted" className="text-xs">
                      📍 {getRoomName(task.roomId)}
                    </Badge>
                  )}

                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  <Badge variant="muted" className="text-xs ml-auto">
                    {task.createdFrom === "TEMPLATE" ? "Auto" : "Manual"}
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="p-12 text-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No tasks found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
