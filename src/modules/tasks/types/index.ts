// ⚠️ BACKEND CONTRACT: Do not modify these types without backend coordination

export type Stakeholder =
  | "SITE_SUPERVISOR"
  | "CLIENT"
  | "DESIGNER"
  | "ELECTRICIAN"
  | "CARPENTER"
  | "THIRD_PARTY"
  | "STORE"
  | "INSTALLER"
  | "PROGRAMMER"
  | "QC";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "DONE";

export type TaskCreatedFrom = "TEMPLATE" | "MANUAL";

// Task Template (future backend entity)
export interface TaskTemplate {
  id: string;
  productCategory: string;
  productSubCategory?: string;
  stakeholder: Stakeholder;
  title: string;
  description?: string;
  isBlocking?: boolean;
  priority?: TaskPriority;
}

// Project Task (runtime instance)
export interface ProjectTask {
  id: string;
  projectId: string;
  taskTemplateId?: string;
  boqItemId?: string;
  roomId?: string;
  title: string;
  description?: string;
  stakeholder: Stakeholder;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  blockerReason?: string;
  createdFrom: TaskCreatedFrom;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilters {
  search?: string;
  stakeholder?: Stakeholder;
  status?: TaskStatus;
  priority?: TaskPriority;
  showOnlyMyTasks?: boolean;
}

export type TaskView = "list" | "board";
