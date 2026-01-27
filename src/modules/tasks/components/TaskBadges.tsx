import { Badge } from "@/components/ui/badge";
import type { TaskStatus, Stakeholder, TaskPriority } from "../types";

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    NOT_STARTED: { variant: "muted" as const, label: "Not Started" },
    IN_PROGRESS: { variant: "default" as const, label: "In Progress" },
    BLOCKED: { variant: "destructive" as const, label: "Blocked" },
    DONE: { variant: "success" as const, label: "Done" },
  };

  const { variant, label } = config[status];

  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  );
}

interface StakeholderBadgeProps {
  stakeholder: Stakeholder;
}

export function StakeholderBadge({ stakeholder }: StakeholderBadgeProps) {
  const labels: Record<Stakeholder, string> = {
    SITE_SUPERVISOR: "Supervisor",
    CLIENT: "Client",
    DESIGNER: "Designer",
    ELECTRICIAN: "Installer",
    CARPENTER: "Carpenter",
    THIRD_PARTY: "3rd Party",
    STORE: "Store",
    INSTALLER: "Installer",
    PROGRAMMER: "Programmer",
    QC: "QC",
  };

  return (
    <Badge variant="outline" className="text-xs">
      {labels[stakeholder]}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = {
    LOW: { variant: "muted" as const, label: "Low" },
    MEDIUM: { variant: "warning" as const, label: "Medium" },
    HIGH: { variant: "destructive" as const, label: "High" },
  };

  const { variant, label } = config[priority];

  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  );
}
