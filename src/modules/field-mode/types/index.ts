import type { ProjectTask } from "@/modules/tasks/types";
import type { AuthUser } from "@/modules/auth/types";

export type FieldTaskFlagReason =
  | "MATERIAL_DAMAGED"
  | "MATERIAL_MISSING"
  | "DEPENDENCY_PENDING"
  | "DESIGN_CLARIFICATION"
  | "CLIENT_ACCESS_ISSUE";

export type FieldTaskActionType =
  | "TASK_COMPLETED"
  | "TASK_PHOTO_ADDED"
  | "TASK_FLAGGED"
  | "TASK_BLOCKED"
  | "TASK_UNBLOCKED"
  | "TASK_NOTE_ADDED";

export interface FieldMedia {
  id: string;
  taskId: string;
  siteId: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  createdAt: string;
}

export interface FieldTaskFlagState {
  isFlagged: boolean;
  reason?: FieldTaskFlagReason;
  note?: string;
  mediaIds?: string[];
}

export interface FieldTaskBlockState {
  isBlocked: boolean;
  reason?: string;
  dependencyTaskId?: string;
  note?: string;
}

export interface FieldTask {
  base: ProjectTask;
  siteId: string;
  photos: string[]; // mediaIds
  flag?: FieldTaskFlagState;
  block?: FieldTaskBlockState;
  lastActionId?: string;
}

export interface FieldSite {
  siteId: string; // projectId
  name: string;
  code: string;
  clientName: string;
  location: string;
}

export interface FieldTaskActionEvent {
  id: string;
  taskId: string;
  siteId: string;
  userId: string;
  userRole: AuthUser["role"];
  timestamp: string;
  actionType: FieldTaskActionType;
  metadata?: Record<string, any>;
  mediaIds?: string[];
}
