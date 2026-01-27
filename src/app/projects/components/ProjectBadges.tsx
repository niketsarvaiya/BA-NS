import { Badge } from "@/components/ui/badge";

export type ProjectHealth = "Good" | "At Risk" | "Critical";
export type ProjectStage = "Design" | "Audit" | "Execution" | "QC" | "Completed";

interface ProjectHealthBadgeProps {
  health: ProjectHealth;
}

export function ProjectHealthBadge({ health }: ProjectHealthBadgeProps) {
  const variant =
    health === "Good"
      ? "success"
      : health === "At Risk"
      ? "warning"
      : "destructive";

  return <Badge variant={variant}>{health}</Badge>;
}

interface StageBadgeProps {
  stage: ProjectStage;
}

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <Badge variant="muted" className="font-normal">
      {stage}
    </Badge>
  );
}
