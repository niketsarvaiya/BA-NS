// ⚠️ BACKEND CONTRACT: Do not modify these types without backend coordination

// BACKEND NOTE:
// Activities are generated from system events + manual inputs.
// Editing allowed only for MOM and notes, not for core metadata.

// BACKEND NOTE:
// Timesheet entries, WhatsApp logs, and task events will map here.

export type ActivityType =
  | "VISIT"
  | "CALL"
  | "NOTE"
  | "TASK_EVENT"
  | "MATERIAL_EVENT"
  | "QC_EVENT"
  | "STATUS_EVENT";

export interface ActivityActor {
  userId: string;
  name: string;
  role: string;
}

export interface ActivityIssue {
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface ActivityAttachment {
  name: string;
  url: string;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  type: ActivityType;
  subType?: string; // e.g., "Supervisor Visit", "Architect Call"
  title: string;
  description?: string;

  actor: ActivityActor;

  date: string; // YYYY-MM-DD (used for grouping)
  time?: string; // HH:mm
  durationMinutes?: number;

  relatedTaskId?: string;
  relatedRoomId?: string;
  relatedBOQItemId?: string;

  momRequired?: boolean;
  mom?: string; // Minutes of Meeting (rich text later)

  attachments?: ActivityAttachment[];
  issuesReported?: ActivityIssue[];

  createdAt: string; // ISO timestamp
}

export interface ActivityFilters {
  activityType?: ActivityType;
  search?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface GroupedActivitiesByDate {
  date: string;
  label: string;
  typeGroups: GroupedActivitiesByType[];
}

export interface GroupedActivitiesByType {
  type: ActivityType;
  label: string;
  activities: ProjectActivity[];
  collapsed: boolean;
}
