import { Building2, MapPin, Calendar, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProjectHealthBadge, StageBadge } from "./ProjectBadges";
import type { Project } from "../types";

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <Card className="border-border bg-card shadow-sm">
      <div className="p-4 md:p-5">
        {/* Top row: Name + Code + Badges */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground truncate">
                {project.name}
              </h1>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                {project.code}
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {project.clientName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <StageBadge stage={project.stage} />
            <ProjectHealthBadge health={project.health} />
          </div>
        </div>

        {/* Bottom row: Meta info */}
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{project.location}</span>
          </div>

          <div className="flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">
              Handover: {project.targetHandoverDate}
            </span>
          </div>

          <div className="flex items-center gap-2 text-foreground">
            <UserCheck className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{project.assignedSupervisor}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
