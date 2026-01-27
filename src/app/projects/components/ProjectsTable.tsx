"use client";

import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProjectHealthBadge, StageBadge } from "./ProjectBadges";
import type { ProjectHealth, ProjectStage } from "./ProjectBadges";

interface Project {
  id: string;
  name: string;
  code: string;
  clientName: string;
  location: string;
  stage: ProjectStage;
  health: ProjectHealth;
  nextMilestone: string;
  lastUpdated: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-001",
    name: "Skyline Tower Upgrade",
    code: "PRJ-2401",
    clientName: "Skyline Properties",
    location: "Mumbai, MH",
    stage: "Execution",
    health: "Good",
    nextMilestone: "Phase 2 QC Review",
    lastUpdated: "2 hours ago",
  },
  {
    id: "proj-002",
    name: "Greenfield Residential Phase A",
    code: "PRJ-2402",
    clientName: "Greenfield Developers",
    location: "Pune, MH",
    stage: "QC",
    health: "At Risk",
    nextMilestone: "Final Inspection",
    lastUpdated: "5 hours ago",
  },
  {
    id: "proj-003",
    name: "Northbridge Hub",
    code: "PRJ-2403",
    clientName: "Northbridge Ventures",
    location: "Bengaluru, KA",
    stage: "Design",
    health: "Good",
    nextMilestone: "Client Approval",
    lastUpdated: "1 day ago",
  },
  {
    id: "proj-004",
    name: "Harbor Point",
    code: "PRJ-2404",
    clientName: "Harbor Realty",
    location: "Chennai, TN",
    stage: "Audit",
    health: "Critical",
    nextMilestone: "Remediation Report",
    lastUpdated: "3 hours ago",
  },
  {
    id: "proj-005",
    name: "Riverside Villas",
    code: "PRJ-2405",
    clientName: "Riverside Holdings",
    location: "Hyderabad, TS",
    stage: "Execution",
    health: "Good",
    nextMilestone: "MEP Handover",
    lastUpdated: "6 hours ago",
  },
  {
    id: "proj-006",
    name: "Central Park Extension",
    code: "PRJ-2406",
    clientName: "Central Park Ltd",
    location: "Delhi, DL",
    stage: "QC",
    health: "Good",
    nextMilestone: "Documentation",
    lastUpdated: "8 hours ago",
  },
  {
    id: "proj-007",
    name: "Coastal Heights",
    code: "PRJ-2407",
    clientName: "Coastal Builders",
    location: "Kochi, KL",
    stage: "Execution",
    health: "At Risk",
    nextMilestone: "Task Allocation",
    lastUpdated: "12 hours ago",
  },
  {
    id: "proj-008",
    name: "Urban Residency Block B",
    code: "PRJ-2408",
    clientName: "Urban Homes",
    location: "Ahmedabad, GJ",
    stage: "Design",
    health: "Good",
    nextMilestone: "Preliminary Drawings",
    lastUpdated: "1 day ago",
  },
];

interface ProjectsTableProps {
  projects?: Project[];
}

export function ProjectsTable({ projects = MOCK_PROJECTS }: ProjectsTableProps) {
  const router = useRouter();

  const handleRowClick = (projectId: string) => {
    router.push(`/projects/${projectId}/overview`);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Next Milestone</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              onClick={() => handleRowClick(project.id)}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-foreground">
                    {project.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{project.code}</span>
                </div>
              </TableCell>
              <TableCell className="text-foreground">
                {project.clientName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.location}
              </TableCell>
              <TableCell>
                <StageBadge stage={project.stage} />
              </TableCell>
              <TableCell>
                <ProjectHealthBadge health={project.health} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.nextMilestone}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {project.lastUpdated}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs transition-smooth"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(project.id);
                  }}
                >
                  View
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
