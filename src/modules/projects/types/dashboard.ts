export type ProjectStage = "DESIGN" | "AUDIT" | "EXECUTION" | "QC_HANDOVER";

export interface StageConfig {
  id: ProjectStage;
  label: string;
  shortLabel: string;
  order: number;
}

export const STAGE_CONFIGS: StageConfig[] = [
  { id: "DESIGN", label: "Design & Planning", shortLabel: "Design", order: 1 },
  { id: "AUDIT", label: "Audit", shortLabel: "Audit", order: 2 },
  { id: "EXECUTION", label: "Execution", shortLabel: "Execution", order: 3 },
  { id: "QC_HANDOVER", label: "QC & Handover", shortLabel: "QC", order: 4 },
];

export interface Priority {
  id: string;
  title: string;
  assignee: string;
  urgency: "HIGH" | "MEDIUM" | "LOW";
  dueDate?: string;
  completed: boolean;
}

export interface Blocker {
  id: string;
  title: string;
  description: string;
  daysBlocked: number;
  owner: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  daysUntil: number;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  progress?: number;
}

export interface ProjectDashboardData {
  projectId: string;
  currentStage: ProjectStage;
  health: "HEALTHY" | "AT_RISK" | "CRITICAL";
  daysToHandover: number;
  openBlockers: number;
  pendingApprovals: number;
  priorities: Priority[];
  blocker: Blocker | null;
  milestones: Milestone[];
  stageSpecificData: Record<string, any>;
}
