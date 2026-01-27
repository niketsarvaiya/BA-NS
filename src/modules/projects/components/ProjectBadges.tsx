import { Badge } from "@/components/ui/badge";
import type { ProjectHealth, ProjectStage } from "../types";

interface ProjectHealthBadgeProps {
  health: ProjectHealth;
  className?: string;
}

export function ProjectHealthBadge({ health, className }: ProjectHealthBadgeProps) {
  const variant =
    health === "Good"
      ? "success"
      : health === "At Risk"
      ? "warning"
      : "destructive";

  return (
    <Badge variant={variant} className={className}>
      {health}
    </Badge>
  );
}

interface StageBadgeProps {
  stage: ProjectStage;
  className?: string;
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  return (
    <Badge variant="muted" className={className}>
      {stage}
    </Badge>
  );
}
