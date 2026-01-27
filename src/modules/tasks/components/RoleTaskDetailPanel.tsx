"use client";

import { useState } from "react";
import {
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  Flag,
  Image as ImageIcon,
  Link,
  User,
  Calendar,
  Tag,
  MapPin,
  Upload,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { RoleBasedTask, TaskActivity, DependencyType } from "../types/role-tasks";
import type { TaskStatus } from "../types";
import { StatusBadge, PriorityBadge, StakeholderBadge } from "./TaskBadges";
import { getTaskActivities } from "../utils/mockRoleTaskData";

interface RoleTaskDetailPanelProps {
  task: RoleBasedTask;
  onClose: () => void;
  onUpdate?: (taskId: string, updates: Partial<RoleBasedTask>) => void;
  roomName?: string;
}

export function RoleTaskDetailPanel({
  task,
  onClose,
  onUpdate,
  roomName,
}: RoleTaskDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"update" | "activity">("update");
  const activities = getTaskActivities(task.id);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-16 bottom-0 right-0 w-[480px] border-l border-border bg-card shadow-xl overflow-hidden z-40 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border bg-card px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={task.status} />
                {task.flagged && (
                  <Badge variant="destructive" className="text-xs">
                    <Flag className="h-3 w-3 mr-1" />
                    Flagged
                  </Badge>
                )}
              </div>
              <h2 className="text-lg font-semibold text-foreground line-clamp-2">
                {task.title}
              </h2>
              {roomName && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {roomName}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "update" | "activity")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="flex-shrink-0 border-b border-border px-6">
            <TabsList className="bg-transparent h-12 p-0 gap-4">
              <TabsTrigger
                value="update"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3"
              >
                Update
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3"
              >
                Activity
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Update Tab */}
          <TabsContent
            value="update"
            className="flex-1 overflow-y-auto m-0 p-6 space-y-6"
          >
            <UpdateTabContent task={task} onUpdate={onUpdate} />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent
            value="activity"
            className="flex-1 overflow-y-auto m-0 p-6"
          >
            <ActivityTabContent activities={activities} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// Update Tab Content
function UpdateTabContent({
  task,
  onUpdate,
}: {
  task: RoleBasedTask;
  onUpdate?: (taskId: string, updates: Partial<RoleBasedTask>) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status);
  const [isFlagged, setIsFlagged] = useState(task.flagged || false);
  const [flagReason, setFlagReason] = useState(task.flagReason || "");
  const [dependencyType, setDependencyType] = useState<DependencyType>(
    task.dependencyType || "NONE"
  );
  const [dependencyNote, setDependencyNote] = useState(task.dependencyNote || "");

  const statusOptions: { value: TaskStatus; label: string; icon: React.ReactNode }[] = [
    {
      value: "NOT_STARTED",
      label: "Not Started",
      icon: <Clock className="h-4 w-4 text-zinc-400" />,
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      icon: <Clock className="h-4 w-4 text-blue-500" />,
    },
    {
      value: "BLOCKED",
      label: "Blocked",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    },
    {
      value: "DONE",
      label: "Done",
      icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    },
  ];

  const handleSave = () => {
    onUpdate?.(task.id, {
      status: selectedStatus,
      flagged: isFlagged,
      flagReason: isFlagged ? flagReason : undefined,
      dependencyType,
      dependencyNote: dependencyType !== "NONE" ? dependencyNote : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Task Description */}
      {task.description && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>
      )}

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Priority</p>
          <PriorityBadge priority={task.priority} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Stakeholder</p>
          <StakeholderBadge stakeholder={task.stakeholder} />
        </div>
      </div>

      {/* Status Change */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Update Status</h3>
        <div className="grid grid-cols-2 gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm",
                selectedStatus === option.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:border-primary/50 text-muted-foreground"
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Upload Image</h3>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Camera className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        </div>
        {task.images && task.images.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {task.images.map((img) => (
              <div
                key={img.id}
                className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center"
              >
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flag Issue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Flag Issue</h3>
          <button
            onClick={() => setIsFlagged(!isFlagged)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              isFlagged ? "bg-orange-500" : "bg-zinc-200 dark:bg-zinc-700"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                isFlagged ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
        {isFlagged && (
          <Textarea
            placeholder="Describe the issue..."
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            className="resize-none"
            rows={2}
          />
        )}
      </div>

      {/* Mark Dependency */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Mark Dependency</h3>
        <Select
          value={dependencyType}
          onValueChange={(v) => setDependencyType(v as DependencyType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select dependency type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">No Dependency</SelectItem>
            <SelectItem value="ARCHITECT">Architect Dependency</SelectItem>
            <SelectItem value="CLIENT">Client Dependency</SelectItem>
            <SelectItem value="THIRD_PARTY">Third Party Dependency</SelectItem>
          </SelectContent>
        </Select>
        {dependencyType !== "NONE" && (
          <Textarea
            placeholder="Add notes about the dependency..."
            value={dependencyNote}
            onChange={(e) => setDependencyNote(e.target.value)}
            className="resize-none"
            rows={2}
          />
        )}
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-border">
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

// Activity Tab Content
function ActivityTabContent({ activities }: { activities: TaskActivity[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">No activity yet</h3>
        <p className="text-sm text-muted-foreground">
          Updates and changes will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

      {/* Activity items */}
      <div className="space-y-6">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: TaskActivity }) {
  const getIcon = () => {
    switch (activity.type) {
      case "STATUS_CHANGE":
        return <CheckCircle className="h-4 w-4" />;
      case "IMAGE_UPLOAD":
        return <ImageIcon className="h-4 w-4" />;
      case "FLAG_ADDED":
      case "FLAG_REMOVED":
        return <Flag className="h-4 w-4" />;
      case "DEPENDENCY_MARKED":
      case "DEPENDENCY_REMOVED":
        return <Link className="h-4 w-4" />;
      case "ASSIGNED":
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getIconColor = () => {
    switch (activity.type) {
      case "STATUS_CHANGE":
        if (activity.metadata?.newStatus === "DONE") return "text-emerald-500";
        if (activity.metadata?.newStatus === "BLOCKED") return "text-red-500";
        return "text-blue-500";
      case "FLAG_ADDED":
        return "text-orange-500";
      case "FLAG_REMOVED":
        return "text-emerald-500";
      default:
        return "text-zinc-500";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="relative flex gap-4 pl-4">
      {/* Icon */}
      <div
        className={cn(
          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border",
          getIconColor()
        )}
      >
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              {activity.userName}
            </p>
            <p className="text-sm text-muted-foreground">{activity.details}</p>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTime(activity.timestamp)}
          </span>
        </div>

        {/* Status change badge */}
        {activity.type === "STATUS_CHANGE" && activity.metadata && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <Badge variant="outline">{activity.metadata.oldStatus}</Badge>
            <span className="text-muted-foreground">→</span>
            <Badge variant="outline">{activity.metadata.newStatus}</Badge>
          </div>
        )}
      </div>
    </div>
  );
}
