// Role-based task system types
import type { ProjectTask, TaskStatus, TaskPriority, Stakeholder } from "./index";

// Dependency types for PM tasks
export type DependencyType = "ARCHITECT" | "CLIENT" | "THIRD_PARTY" | "NONE";

// Task role categories
export type TaskRoleCategory = "PM" | "INSTALLER" | "PROGRAMMER" | "QC";

// Extended task with role-specific fields
export interface RoleBasedTask extends ProjectTask {
  roleCategory: TaskRoleCategory;
  dependencyType?: DependencyType;
  dependencyNote?: string;
  roomId?: string;
  isGeneralTask?: boolean;
  isHygieneTask?: boolean;
  flagged?: boolean;
  flagReason?: string;
  images?: TaskImage[];
}

// Task image attachment
export interface TaskImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedAt: string;
  caption?: string;
}

// Activity log entry
export interface TaskActivity {
  id: string;
  taskId: string;
  type: TaskActivityType;
  userId: string;
  userName: string;
  timestamp: string;
  details: string;
  metadata?: TaskActivityMetadata;
}

export type TaskActivityType =
  | "STATUS_CHANGE"
  | "IMAGE_UPLOAD"
  | "FLAG_ADDED"
  | "FLAG_REMOVED"
  | "DEPENDENCY_MARKED"
  | "DEPENDENCY_REMOVED"
  | "COMMENT_ADDED"
  | "ASSIGNED"
  | "CREATED";

export interface TaskActivityMetadata {
  oldStatus?: TaskStatus;
  newStatus?: TaskStatus;
  imageId?: string;
  dependencyType?: DependencyType;
  flagReason?: string;
  comment?: string;
}

// Room group for task organization
export interface TaskRoomGroup {
  roomId: string;
  roomName: string;
  tasks: RoleBasedTask[];
  isExpanded?: boolean;
}

// Special task groups
export interface SpecialTaskGroup {
  id: "general" | "hygiene";
  name: string;
  tasks: RoleBasedTask[];
  isExpanded?: boolean;
}

// Project scope for conditional features
export interface ProjectScope {
  projectId: string;
  includesAutomation: boolean;
  includesAV: boolean;
  includesSecurity: boolean;
  includesLighting: boolean;
  includesHVAC: boolean;
}

// Task update payload
export interface TaskUpdatePayload {
  status?: TaskStatus;
  flagged?: boolean;
  flagReason?: string;
  dependencyType?: DependencyType;
  dependencyNote?: string;
  images?: TaskImage[];
}

// PM Task sub-tabs
export type PMTaskSubTab = "all" | "architect" | "client" | "third-party";

// Stats for task overview
export interface TaskStats {
  total: number;
  notStarted: number;
  inProgress: number;
  blocked: number;
  done: number;
}
