import type { ActivityType, ProjectActivity } from "../types";
import {
  MapPin,
  Phone,
  FileText,
  CheckCircle2,
  Package,
  ClipboardCheck,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  VISIT: "Site Visit",
  CALL: "Call",
  NOTE: "Note",
  TASK_EVENT: "Task Event",
  MATERIAL_EVENT: "Material Event",
  QC_EVENT: "QC Event",
  STATUS_EVENT: "Status Event",
};

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, LucideIcon> = {
  VISIT: MapPin,
  CALL: Phone,
  NOTE: FileText,
  TASK_EVENT: CheckCircle2,
  MATERIAL_EVENT: Package,
  QC_EVENT: ClipboardCheck,
  STATUS_EVENT: RefreshCw,
};

export const ACTIVITY_TYPE_COLORS: Record<
  ActivityType,
  { bg: string; text: string; icon: string }
> = {
  VISIT: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-700 dark:text-purple-300",
    icon: "text-purple-600 dark:text-purple-400",
  },
  CALL: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400",
  },
  NOTE: {
    bg: "bg-slate-50 dark:bg-slate-800/50",
    text: "text-slate-700 dark:text-slate-300",
    icon: "text-slate-600 dark:text-slate-400",
  },
  TASK_EVENT: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400",
  },
  MATERIAL_EVENT: {
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
    text: "text-indigo-700 dark:text-indigo-300",
    icon: "text-indigo-600 dark:text-indigo-400",
  },
  QC_EVENT: {
    bg: "bg-teal-50 dark:bg-teal-950/20",
    text: "text-teal-700 dark:text-teal-300",
    icon: "text-teal-600 dark:text-teal-400",
  },
  STATUS_EVENT: {
    bg: "bg-violet-50 dark:bg-violet-950/20",
    text: "text-violet-700 dark:text-violet-300",
    icon: "text-violet-600 dark:text-violet-400",
  },
};

/**
 * Calculate activity summary statistics
 */
export function calculateActivitySummary(activities: ProjectActivity[]) {
  const lastVisit = activities.find((a) => a.type === "VISIT");
  const lastCall = activities.find((a) => a.type === "CALL");
  
  const openIssues = activities.reduce((count, activity) => {
    return count + (activity.issuesReported?.length || 0);
  }, 0);

  const last7Days = activities.filter((activity) => {
    const activityDate = new Date(activity.date);
    const now = new Date();
    const daysDiff = Math.floor(
      (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff <= 7;
  }).length;

  const momPending = activities.filter(
    (activity) => activity.momRequired && !activity.mom
  ).length;

  return {
    lastVisit,
    lastCall,
    openIssues,
    last7Days,
    momPending,
  };
}
