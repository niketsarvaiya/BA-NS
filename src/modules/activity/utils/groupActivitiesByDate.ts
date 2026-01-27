import type {
  ProjectActivity,
  GroupedActivitiesByDate,
  GroupedActivitiesByType,
  ActivityType,
} from "../types";

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  VISIT: "VISITS",
  CALL: "CALLS",
  NOTE: "NOTES",
  TASK_EVENT: "TASK EVENTS",
  MATERIAL_EVENT: "MATERIAL EVENTS",
  QC_EVENT: "QC EVENTS",
  STATUS_EVENT: "STATUS EVENTS",
};

const ACTIVITY_TYPE_ORDER: ActivityType[] = [
  "VISIT",
  "CALL",
  "NOTE",
  "TASK_EVENT",
  "MATERIAL_EVENT",
  "QC_EVENT",
  "STATUS_EVENT",
];

/**
 * Groups activities by date, then by type within each date
 *
 * Returns groups sorted newest → oldest
 * Within each group, type groups follow a specific order
 * Within each type group, activities sorted newest → oldest
 */
export function groupActivitiesByDateAndType(
  activities: ProjectActivity[]
): GroupedActivitiesByDate[] {
  // Sort activities newest first
  const sorted = [...activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Group by date
  const dateGroups = new Map<string, ProjectActivity[]>();

  sorted.forEach((activity) => {
    const dateKey = activity.date; // Already in YYYY-MM-DD format

    if (!dateGroups.has(dateKey)) {
      dateGroups.set(dateKey, []);
    }
    dateGroups.get(dateKey)!.push(activity);
  });

  // Convert to array with labels and type groups
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const result: GroupedActivitiesByDate[] = [];

  dateGroups.forEach((activities, dateKey) => {
    let label: string;

    if (dateKey === today) {
      label = "Today";
    } else if (dateKey === yesterday) {
      label = "Yesterday";
    } else {
      const date = new Date(dateKey);
      label = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    // Group activities by type
    const typeGroups = new Map<ActivityType, ProjectActivity[]>();
    activities.forEach((activity) => {
      if (!typeGroups.has(activity.type)) {
        typeGroups.set(activity.type, []);
      }
      typeGroups.get(activity.type)!.push(activity);
    });

    // Convert to sorted array
    const sortedTypeGroups: GroupedActivitiesByType[] = [];
    ACTIVITY_TYPE_ORDER.forEach((type) => {
      if (typeGroups.has(type)) {
        sortedTypeGroups.push({
          type,
          label: ACTIVITY_TYPE_LABELS[type],
          activities: typeGroups.get(type)!,
          collapsed: false,
        });
      }
    });

    result.push({
      date: dateKey,
      label,
      typeGroups: sortedTypeGroups,
    });
  });

  return result;
}

/**
 * Format time for display (e.g., "2:30 PM")
 */
export function formatActivityTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format duration for display (e.g., "2h 30m" or "45m")
 */
export function formatDuration(minutes?: number): string {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
}
