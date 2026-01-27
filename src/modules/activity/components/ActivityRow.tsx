import type { ProjectActivity } from "../types";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Paperclip, FileCheck } from "lucide-react";
import {
  ACTIVITY_TYPE_ICONS,
  ACTIVITY_TYPE_COLORS,
} from "../utils/activityHelpers";
import { formatDuration } from "../utils/groupActivitiesByDate";

interface ActivityRowProps {
  activity: ProjectActivity;
  onClick: () => void;
}

export function ActivityRow({ activity, onClick }: ActivityRowProps) {
  const Icon = ACTIVITY_TYPE_ICONS[activity.type];
  const colors = ACTIVITY_TYPE_COLORS[activity.type];

  const hasMomPending = activity.momRequired && !activity.mom;
  const hasIssues = (activity.issuesReported?.length || 0) > 0;
  const hasAttachments = (activity.attachments?.length || 0) > 0;

  return (
    <div
      onClick={onClick}
      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:bg-slate-50 cursor-pointer transition-colors dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800/50"
    >
      {/* Icon */}
      <div className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg ${colors.bg}`}>
        <Icon className={`h-5 w-5 ${colors.icon}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {activity.title}
            </h4>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{activity.actor.name}</span>
              {activity.time && (
                <>
                  <span>•</span>
                  <span>{activity.time}</span>
                </>
              )}
              {activity.durationMinutes && (
                <>
                  <span>•</span>
                  <span>{formatDuration(activity.durationMinutes)}</span>
                </>
              )}
            </div>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-1.5 justify-end">
            {hasMomPending && (
              <Badge
                variant="warning"
                className="flex items-center gap-1 text-xs"
              >
                <FileCheck className="h-3 w-3" />
                MOM Pending
              </Badge>
            )}
            {hasIssues && (
              <Badge
                variant="destructive"
                className="flex items-center gap-1 text-xs"
              >
                <AlertCircle className="h-3 w-3" />
                {activity.issuesReported!.length} Issue
                {activity.issuesReported!.length > 1 ? "s" : ""}
              </Badge>
            )}
            {hasAttachments && (
              <Badge variant="muted" className="flex items-center gap-1 text-xs">
                <Paperclip className="h-3 w-3" />
                {activity.attachments!.length}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
