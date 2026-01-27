"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Building2,
  Users,
  Briefcase,
  ListChecks,
  Plus,
  Search,
  Download,
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { RoleBasedTask, PMTaskSubTab, DependencyType } from "../types/role-tasks";
import { RoleTaskItem, CompactTaskItem } from "./RoleTaskItem";
import { RoleTaskDetailPanel } from "./RoleTaskDetailPanel";
import { MOCK_PM_TASKS, calculateTaskStats } from "../utils/mockRoleTaskData";

interface PMTasksViewProps {
  projectId?: string;
}

export function PMTasksView({ projectId }: PMTasksViewProps) {
  const [tasks, setTasks] = useState<RoleBasedTask[]>(MOCK_PM_TASKS);
  const [activeTab, setActiveTab] = useState<PMTaskSubTab>("all");
  const [selectedTask, setSelectedTask] = useState<RoleBasedTask | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [selectedDependencies, setSelectedDependencies] = useState<DependencyType[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDownloadDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDependency = (dep: DependencyType) => {
    setSelectedDependencies((prev) =>
      prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep]
    );
  };

  const handleDownload = () => {
    if (selectedDependencies.length === 0) {
      alert("Please select at least one dependency type");
      return;
    }
    // Mock download action
    const depNames = selectedDependencies.map((d) => {
      if (d === "ARCHITECT") return "Architect";
      if (d === "CLIENT") return "Client";
      if (d === "THIRD_PARTY") return "Third Party";
      return d;
    });
    alert(`Downloading dependency list for: ${depNames.join(", ")}\n\nThis is a mock action.`);
    setShowDownloadDropdown(false);
    setSelectedDependencies([]);
  };

  // Filter tasks based on active tab and search
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by dependency type
    if (activeTab === "architect") {
      filtered = filtered.filter((t) => t.dependencyType === "ARCHITECT");
    } else if (activeTab === "client") {
      filtered = filtered.filter((t) => t.dependencyType === "CLIENT");
    } else if (activeTab === "third-party") {
      filtered = filtered.filter((t) => t.dependencyType === "THIRD_PARTY");
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, activeTab, searchQuery]);

  // Calculate stats for each tab
  const stats = useMemo(() => {
    return {
      all: calculateTaskStats(tasks),
      architect: calculateTaskStats(
        tasks.filter((t) => t.dependencyType === "ARCHITECT")
      ),
      client: calculateTaskStats(
        tasks.filter((t) => t.dependencyType === "CLIENT")
      ),
      thirdParty: calculateTaskStats(
        tasks.filter((t) => t.dependencyType === "THIRD_PARTY")
      ),
    };
  }, [tasks]);

  const handleTaskUpdate = (
    taskId: string,
    updates: Partial<RoleBasedTask>
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    setSelectedTask(null);
  };

  const subTabs: {
    id: PMTaskSubTab;
    label: string;
    icon: React.ReactNode;
    count: number;
  }[] = [
    {
      id: "all",
      label: "All Tasks",
      icon: <ListChecks className="h-4 w-4" />,
      count: stats.all.total,
    },
    {
      id: "architect",
      label: "Architect",
      icon: <Building2 className="h-4 w-4" />,
      count: stats.architect.total,
    },
    {
      id: "client",
      label: "Client",
      icon: <Users className="h-4 w-4" />,
      count: stats.client.total,
    },
    {
      id: "third-party",
      label: "Third Party",
      icon: <Briefcase className="h-4 w-4" />,
      count: stats.thirdParty.total,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
            PM Tasks
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Coordination and dependency management
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Download Dependency List Button */}
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
            >
              <Download className="h-4 w-4" />
              Download Dependency List
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                showDownloadDropdown && "rotate-180"
              )} />
            </Button>

            {/* Dropdown */}
            {showDownloadDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg z-50">
                <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    Select dependency types
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Choose which dependencies to include
                  </p>
                </div>
                <div className="p-2">
                  <DependencyCheckbox
                    label="Architect Dependencies"
                    icon={<Building2 className="h-4 w-4 text-blue-600" />}
                    checked={selectedDependencies.includes("ARCHITECT")}
                    onChange={() => toggleDependency("ARCHITECT")}
                  />
                  <DependencyCheckbox
                    label="Client Dependencies"
                    icon={<Users className="h-4 w-4 text-green-600" />}
                    checked={selectedDependencies.includes("CLIENT")}
                    onChange={() => toggleDependency("CLIENT")}
                  />
                  <DependencyCheckbox
                    label="Third Party Dependencies"
                    icon={<Briefcase className="h-4 w-4 text-orange-600" />}
                    checked={selectedDependencies.includes("THIRD_PARTY")}
                    onChange={() => toggleDependency("THIRD_PARTY")}
                  />
                </div>
                <div className="p-2 border-t border-zinc-200 dark:border-zinc-800">
                  <Button
                    onClick={handleDownload}
                    className="w-full gap-2"
                    disabled={selectedDependencies.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Download ({selectedDependencies.length} selected)
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button className="gap-2" disabled>
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.all.total} />
        <StatCard
          label="Not Started"
          value={stats.all.notStarted}
          color="zinc"
        />
        <StatCard
          label="In Progress"
          value={stats.all.inProgress}
          color="blue"
        />
        <StatCard label="Blocked" value={stats.all.blocked} color="red" />
        <StatCard label="Done" value={stats.all.done} color="emerald" />
      </div>

      {/* Sub-tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as PMTaskSubTab)}
      >
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800">
          <TabsList className="bg-transparent p-0 h-auto gap-1">
            {subTabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-50",
                  "data-[state=active]:shadow-none text-sm px-4 py-2 rounded-t-lg rounded-b-none",
                  "flex items-center gap-2"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className="ml-1 text-xs opacity-70">({tab.count})</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Search */}
          <div className="relative w-64 pb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Task List */}
        <TabsContent value={activeTab} className="mt-4">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 overflow-hidden">
            {filteredTasks.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredTasks.map((task) => (
                  <RoleTaskItem
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Detail Panel */}
      {selectedTask && (
        <RoleTaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
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
      <p className={cn("text-2xl font-semibold", colorClasses[color])}>
        {value}
      </p>
    </div>
  );
}

function EmptyState({ tab }: { tab: PMTaskSubTab }) {
  const messages: Record<PMTaskSubTab, string> = {
    all: "No PM tasks found",
    architect: "No architect dependencies",
    client: "No client dependencies",
    "third-party": "No third party dependencies",
  };

  return (
    <div className="p-12 text-center">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {messages[tab]}
      </p>
    </div>
  );
}

function DependencyCheckbox({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left",
        checked
          ? "bg-zinc-100 dark:bg-zinc-800"
          : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
      )}
    >
      <div
        className={cn(
          "h-4 w-4 rounded border-2 flex items-center justify-center transition-colors",
          checked
            ? "bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50"
            : "border-zinc-300 dark:border-zinc-600"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white dark:text-zinc-900" />}
      </div>
      {icon}
      <span className="text-sm text-zinc-700 dark:text-zinc-300">{label}</span>
    </button>
  );
}
