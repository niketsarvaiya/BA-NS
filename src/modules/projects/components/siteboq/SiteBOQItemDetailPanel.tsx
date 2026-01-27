"use client";

import React, { useMemo, useState } from "react";
import type { SiteBOQItem } from "../../types/siteBOQ";
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";
import { Package, AlertCircle, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { useFieldTasks } from "@/modules/field-mode/hooks/useFieldTasks";
import type { FieldTask } from "@/modules/field-mode/types";
import { FieldTaskActionSheet } from "@/modules/field-mode/components/FieldTaskActionSheet";

interface SiteBOQItemDetailPanelProps {
  item: SiteBOQItem;
  onClose: () => void;
}

export function SiteBOQItemDetailPanel({ item, onClose }: SiteBOQItemDetailPanelProps) {
  const { user } = useAuth();
  const fieldCtx = useFieldTasks();
  const [activeTask, setActiveTask] = useState<FieldTask | null>(null);

  const iconElement = (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/20">
      <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
    </div>
  );

  // Calculate current bottleneck
  const getBottleneck = () => {
    if (!item.status.ordered) return "Not Ordered";
    if (!item.status.assigned) return "Not Assigned";
    if (!item.status.delivered) return "Not Delivered";
    if (!item.status.installed) return "Not Installed";
    if (!item.status.programmed) return "Not Programmed";
    if (!item.status.qced) return "Not QCed";
    return null;
  };

  const bottleneck = getBottleneck();
  const isComplete = Object.values(item.status).every((v) => v);

  const roleStakeholders: string[] = useMemo(() => {
    if (!user) return [];
    switch (user.role) {
      case "technician":
        return ["ELECTRICIAN", "INSTALLER"];
      case "programmer":
        return ["PROGRAMMER"];
      case "qc":
        return ["QC"];
      default:
        return [];
    }
  }, [user]);

  const roleTasks = useMemo(() => {
    if (!roleStakeholders.length) return [] as FieldTask[];
    return fieldCtx.tasks.filter((t) => {
      const matchesRole = roleStakeholders.includes(t.base.stakeholder as string);
      const matchesItem = t.base.title.includes(item.itemName);
      return matchesRole && matchesItem;
    });
  }, [fieldCtx.tasks, roleStakeholders, item.itemName]);

  return (
    <DetailPanel
      isOpen={true}
      onClose={onClose}
      title={item.itemName}
      subtitle={`Site BOQ Item • ${item.quantity} units`}
      icon={iconElement}
      width="lg"
    >
      <div className="space-y-6">
        {/* Item Summary */}
        <div className="grid grid-cols-2 gap-4">
          <DetailPanelSection title="Description">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {item.description || "—"}
            </div>
          </DetailPanelSection>

          <DetailPanelSection title="Quantity">
            <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {item.quantity}
            </div>
          </DetailPanelSection>
        </div>

        {/* Current Bottleneck */}
        {bottleneck ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-1">
                  Current Bottleneck
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  {bottleneck}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                  Item Complete
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">
                  All lifecycle stages completed
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Breakdown */}
        <DetailPanelSection title="Lifecycle Status">
          <div className="space-y-2">
            <StatusRow label="Ordered" value={item.status.ordered} />
            <StatusRow label="Assigned" value={item.status.assigned} />
            <StatusRow label="Delivered" value={item.status.delivered} />
            <StatusRow label="Installed" value={item.status.installed} />
            <StatusRow label="Programmed" value={item.status.programmed} />
            <StatusRow label="QC Approved" value={item.status.qced} />
          </div>
        </DetailPanelSection>

        {/* Last Updated */}
        <DetailPanelSection title="Last Updated" icon={<Clock className="h-3.5 w-3.5" />}>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {new Date(item.lastUpdatedAt).toLocaleString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            By {item.lastUpdatedBy}
          </div>
        </DetailPanelSection>

        {/* Field Tasks for current role */}
        {user && (
          <DetailPanelSection
            title="Your Tasks for This Item"
            icon={<ListChecks className="h-3.5 w-3.5" />}
          >
            {roleTasks.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No tasks mapped to your role for this item.
              </p>
            ) : (
              <div className="space-y-2">
                {roleTasks.map((task) => (
                  <button
                    key={task.base.id}
                    type="button"
                    onClick={() => setActiveTask(task)}
                    className="w-full flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-left hover:border-indigo-400 hover:shadow-sm transition-smooth"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {task.base.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Status: {task.base.status === "DONE" ? "Completed" : "Open"}
                      </p>
                    </div>
                    {task.flag?.isFlagged && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 px-2 py-0.5 text-[10px]">
                        Flagged
                      </span>
                    )}
                    {task.block?.isBlocked && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 px-2 py-0.5 text-[10px]">
                        Blocked
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </DetailPanelSection>
        )}
      </div>

      {/* Bottom-sheet task actions */}
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
          fieldCtx.flagTask(taskId, reason, { note: opts?.note, mediaIds: opts?.mediaIds });
        }}
        onBlocked={(taskId, isBlocked, opts) => {
          fieldCtx.setBlocked(taskId, isBlocked, opts);
        }}
        onAddNote={(taskId, note) => {
          fieldCtx.addNote(taskId, note);
        }}
      />
    </DetailPanel>
  );
}

// Helper component for status rows
function StatusRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
        {label}
      </span>
      <Badge
        variant={value ? "success" : "muted"}
        className="text-xs"
      >
        {value ? "Completed" : "Pending"}
      </Badge>
    </div>
  );
}
