import type { ProjectTask } from "../types";
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";
import { CheckCircle, Calendar, User, Tag, Package, MapPin } from "lucide-react";
import { StatusBadge, StakeholderBadge, PriorityBadge } from "./TaskBadges";

interface TaskDetailPanelProps {
  task: ProjectTask;
  onClose: () => void;
  getBOQItemName?: (boqItemId: string) => string;
  getRoomName?: (roomId: string) => string;
}

export function TaskDetailPanel({
  task,
  onClose,
  getBOQItemName,
  getRoomName,
}: TaskDetailPanelProps) {
  const iconElement = (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/20">
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
    </div>
  );

  return (
    <DetailPanel
      isOpen={true}
      onClose={onClose}
      title={task.title}
      subtitle={`Task • ${task.stakeholder}`}
      icon={iconElement}
      width="lg"
    >
      <div className="space-y-6">
        {/* Status, Priority, Stakeholder */}
        <div className="grid grid-cols-3 gap-4">
          <DetailPanelSection title="Status" icon={<Tag className="h-3.5 w-3.5" />}>
            <StatusBadge status={task.status} />
          </DetailPanelSection>

          <DetailPanelSection title="Priority" icon={<Tag className="h-3.5 w-3.5" />}>
            <PriorityBadge priority={task.priority} />
          </DetailPanelSection>

          <DetailPanelSection title="Stakeholder" icon={<User className="h-3.5 w-3.5" />}>
            <StakeholderBadge stakeholder={task.stakeholder} />
          </DetailPanelSection>
        </div>

        {/* Description */}
        {task.description && (
          <DetailPanelSection title="Description">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {task.description}
            </p>
          </DetailPanelSection>
        )}

        {/* Related Items */}
        <div className="grid grid-cols-2 gap-4">
          {task.boqItemId && getBOQItemName && (
            <DetailPanelSection title="BOQ Item" icon={<Package className="h-3.5 w-3.5" />}>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {getBOQItemName(task.boqItemId)}
              </div>
            </DetailPanelSection>
          )}

          {task.roomId && getRoomName && (
            <DetailPanelSection title="Room" icon={<MapPin className="h-3.5 w-3.5" />}>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {getRoomName(task.roomId)}
              </div>
            </DetailPanelSection>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <DetailPanelSection title="Due Date" icon={<Calendar className="h-3.5 w-3.5" />}>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </DetailPanelSection>
        )}

        {/* Metadata */}
        <DetailPanelSection title="Task Information">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Created From
              </div>
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {task.createdFrom === "TEMPLATE" ? "Auto-generated" : "Manual"}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Template ID
              </div>
              <div className="font-medium text-slate-900 dark:text-slate-100">
                {task.taskTemplateId || "N/A"}
              </div>
            </div>
          </div>
        </DetailPanelSection>

        {/* Placeholder sections for future features */}
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Additional features coming soon:
          </p>
          <ul className="mt-2 text-xs text-slate-400 dark:text-slate-500 space-y-1">
            <li>• Subtasks & checklist</li>
            <li>• Activity log & history</li>
            <li>• Comments & collaboration</li>
            <li>• Helpful resources & tutorials</li>
          </ul>
        </div>
      </div>
    </DetailPanel>
  );
}
