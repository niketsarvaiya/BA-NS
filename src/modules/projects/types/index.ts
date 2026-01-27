export type ProjectStage = "Design" | "Audit" | "Execution" | "QC" | "Completed";
export type ProjectHealth = "Good" | "At Risk" | "Critical";

export interface Project {
  id: string;
  name: string;
  code: string;
  clientName: string;
  location: string;
  stage: ProjectStage;
  health: ProjectHealth;
  targetHandoverDate: string;
  assignedSupervisor: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectTab {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
}

// Re-export QC-related types so other modules can import from a single entrypoint.
export * from "./qc";
