import type { ProjectStage as DashboardStage } from "../types/dashboard";
import type { ProjectStage, ProjectHealth } from "../types";

// Map from project stage labels to dashboard stage IDs
export function mapProjectStageToDashboardStage(
  projectStage: ProjectStage
): DashboardStage {
  const mapping: Record<ProjectStage, DashboardStage> = {
    Design: "DESIGN",
    Audit: "AUDIT",
    Execution: "EXECUTION",
    QC: "QC_HANDOVER",
    Completed: "QC_HANDOVER", // Completed projects map to QC_HANDOVER stage
  };

  return mapping[projectStage];
}

// Map project health to dashboard health format
export function mapProjectHealthToDashboardHealth(
  projectHealth: ProjectHealth
): "HEALTHY" | "AT_RISK" | "CRITICAL" {
  const mapping: Record<ProjectHealth, "HEALTHY" | "AT_RISK" | "CRITICAL"> = {
    Good: "HEALTHY",
    "At Risk": "AT_RISK",
    Critical: "CRITICAL",
  };

  return mapping[projectHealth];
}
