import type {
  ProjectDashboardData,
  ProjectStage,
  Priority,
  Blocker,
  Milestone,
} from "../types/dashboard";

export function getMockDashboardData(
  projectId: string,
  currentStage: ProjectStage,
  health: "HEALTHY" | "AT_RISK" | "CRITICAL"
): ProjectDashboardData {
  const baseData: ProjectDashboardData = {
    projectId,
    currentStage,
    health,
    daysToHandover: getDaysToHandover(currentStage, health),
    openBlockers: getOpenBlockers(currentStage, health),
    pendingApprovals: getPendingApprovals(currentStage),
    priorities: getPriorities(currentStage),
    blocker: getBlocker(currentStage, health),
    milestones: getMilestones(currentStage),
    stageSpecificData: getStageSpecificData(currentStage, health),
  };

  return baseData;
}

function getDaysToHandover(stage: ProjectStage, health: "HEALTHY" | "AT_RISK" | "CRITICAL"): number {
  const baseDays = {
    DESIGN: 120,
    AUDIT: 90,
    EXECUTION: 45,
    QC_HANDOVER: 15,
  };

  const healthModifier = {
    HEALTHY: 0,
    AT_RISK: -10,
    CRITICAL: -20,
  };

  return baseDays[stage] + healthModifier[health];
}

function getOpenBlockers(stage: ProjectStage, health: "HEALTHY" | "AT_RISK" | "CRITICAL"): number {
  if (health === "CRITICAL") return Math.floor(Math.random() * 3) + 2;
  if (health === "AT_RISK") return Math.floor(Math.random() * 2) + 1;
  return 0;
}

function getPendingApprovals(stage: ProjectStage): number {
  const approvals = {
    DESIGN: 3,
    AUDIT: 2,
    EXECUTION: 1,
    QC_HANDOVER: 4,
  };
  return approvals[stage];
}

function getPriorities(stage: ProjectStage): Priority[] {
  const prioritiesByStage = {
    DESIGN: [
      {
        id: "p1",
        title: "Finalize architectural drawings for floors 3-5",
        assignee: "Rajesh Kumar",
        urgency: "HIGH" as const,
        dueDate: "Today",
        completed: false,
      },
      {
        id: "p2",
        title: "Get MEP sign-off from consultant",
        assignee: "Priya Sharma",
        urgency: "MEDIUM" as const,
        dueDate: "Tomorrow",
        completed: false,
      },
      {
        id: "p3",
        title: "Update structural calculations for beam B-12",
        assignee: "Amit Patel",
        urgency: "LOW" as const,
        dueDate: "Jan 30",
        completed: false,
      },
    ],
    AUDIT: [
      {
        id: "p1",
        title: "Schedule audit with DGPS team",
        assignee: "Vikram Singh",
        urgency: "HIGH" as const,
        dueDate: "Today",
        completed: false,
      },
      {
        id: "p2",
        title: "Prepare site documentation package",
        assignee: "Neha Gupta",
        urgency: "HIGH" as const,
        dueDate: "Tomorrow",
        completed: false,
      },
      {
        id: "p3",
        title: "Address previous audit findings (3 open)",
        assignee: "Suresh Reddy",
        urgency: "MEDIUM" as const,
        dueDate: "Jan 31",
        completed: false,
      },
    ],
    EXECUTION: [
      {
        id: "p1",
        title: "Complete cable pulling in Zone A (80% done)",
        assignee: "Ravi Kumar",
        urgency: "HIGH" as const,
        dueDate: "Today",
        completed: false,
      },
      {
        id: "p2",
        title: "Install remaining 24 cameras in Block B",
        assignee: "Anil Mehta",
        urgency: "HIGH" as const,
        dueDate: "Tomorrow",
        completed: false,
      },
      {
        id: "p3",
        title: "Test fiber backbone connectivity",
        assignee: "Deepak Joshi",
        urgency: "MEDIUM" as const,
        dueDate: "Jan 29",
        completed: false,
      },
    ],
    QC_HANDOVER: [
      {
        id: "p1",
        title: "Complete final QC inspection checklist",
        assignee: "Manoj Verma",
        urgency: "HIGH" as const,
        dueDate: "Today",
        completed: false,
      },
      {
        id: "p2",
        title: "Prepare handover documentation (85% done)",
        assignee: "Kavita Nair",
        urgency: "HIGH" as const,
        dueDate: "Tomorrow",
        completed: false,
      },
      {
        id: "p3",
        title: "Schedule client walkthrough",
        assignee: "Sanjay Kapoor",
        urgency: "MEDIUM" as const,
        dueDate: "Jan 30",
        completed: false,
      },
    ],
  };

  return prioritiesByStage[stage];
}

function getBlocker(stage: ProjectStage, health: "HEALTHY" | "AT_RISK" | "CRITICAL"): Blocker | null {
  if (health !== "CRITICAL" && health !== "AT_RISK") return null;

  const blockersByStage = {
    DESIGN: {
      id: "b1",
      title: "MEP drawings not yet received",
      description:
        "Waiting for consultant to submit updated MEP drawings for coordination.",
      daysBlocked: 5,
      owner: "Priya Sharma",
    },
    AUDIT: {
      id: "b1",
      title: "Audit team availability",
      description:
        "DGPS audit team unavailable until Feb 5 due to other commitments.",
      daysBlocked: 8,
      owner: "Vikram Singh",
    },
    EXECUTION: {
      id: "b1",
      title: "Material shortage - fiber cables",
      description:
        "Awaiting delivery of 2km fiber cable. Supplier ETA: 3 days.",
      daysBlocked: 4,
      owner: "Procurement Team",
    },
    QC_HANDOVER: {
      id: "b1",
      title: "Pending client sign-off on punch list",
      description:
        "Client needs to approve 12 completed punch list items before final handover.",
      daysBlocked: 6,
      owner: "Client - Ramesh Iyer",
    },
  };

  return blockersByStage[stage];
}

function getMilestones(stage: ProjectStage): Milestone[] {
  const milestonesByStage = {
    DESIGN: [
      {
        id: "m1",
        title: "Design Freeze",
        date: "Feb 15, 2025",
        daysUntil: 19,
        status: "IN_PROGRESS" as const,
        progress: 75,
      },
      {
        id: "m2",
        title: "Client Design Approval",
        date: "Feb 28, 2025",
        daysUntil: 32,
        status: "UPCOMING" as const,
      },
      {
        id: "m3",
        title: "Kickoff Audit Phase",
        date: "Mar 5, 2025",
        daysUntil: 37,
        status: "UPCOMING" as const,
      },
    ],
    AUDIT: [
      {
        id: "m1",
        title: "DGPS Audit Scheduled",
        date: "Feb 1, 2025",
        daysUntil: 5,
        status: "IN_PROGRESS" as const,
        progress: 60,
      },
      {
        id: "m2",
        title: "Audit Report Submission",
        date: "Feb 10, 2025",
        daysUntil: 14,
        status: "UPCOMING" as const,
      },
      {
        id: "m3",
        title: "All Findings Closed",
        date: "Feb 20, 2025",
        daysUntil: 24,
        status: "UPCOMING" as const,
      },
    ],
    EXECUTION: [
      {
        id: "m1",
        title: "Zone A Cable Installation Complete",
        date: "Jan 29, 2025",
        daysUntil: 2,
        status: "IN_PROGRESS" as const,
        progress: 85,
      },
      {
        id: "m2",
        title: "All Camera Installation Complete",
        date: "Feb 5, 2025",
        daysUntil: 9,
        status: "UPCOMING" as const,
      },
      {
        id: "m3",
        title: "System Integration Testing",
        date: "Feb 15, 2025",
        daysUntil: 19,
        status: "UPCOMING" as const,
      },
    ],
    QC_HANDOVER: [
      {
        id: "m1",
        title: "Final QC Inspection",
        date: "Jan 30, 2025",
        daysUntil: 3,
        status: "IN_PROGRESS" as const,
        progress: 90,
      },
      {
        id: "m2",
        title: "Punch List Completion",
        date: "Feb 5, 2025",
        daysUntil: 9,
        status: "UPCOMING" as const,
      },
      {
        id: "m3",
        title: "Project Handover",
        date: "Feb 12, 2025",
        daysUntil: 16,
        status: "UPCOMING" as const,
      },
    ],
  };

  return milestonesByStage[stage];
}

function getStageSpecificData(
  stage: ProjectStage,
  health: "HEALTHY" | "AT_RISK" | "CRITICAL"
): ProjectDashboardData["stageSpecificData"] {
  switch (stage) {
    case "DESIGN":
      return {
        designApprovalProgress: health === "HEALTHY" ? 85 : health === "AT_RISK" ? 60 : 40,
        drawingsCompleted: health === "HEALTHY" ? 42 : health === "AT_RISK" ? 35 : 28,
        drawingsTotal: 50,
      };
    case "AUDIT":
      return {
        auditScheduled: health !== "CRITICAL",
        auditDate: health !== "CRITICAL" ? "Feb 1, 2025" : undefined,
        findingsOpen: health === "CRITICAL" ? 8 : health === "AT_RISK" ? 4 : 0,
        findingsClosed: health === "HEALTHY" ? 12 : health === "AT_RISK" ? 8 : 4,
      };
    case "EXECUTION":
      return {
        tasksCompleted: health === "HEALTHY" ? 156 : health === "AT_RISK" ? 128 : 98,
        tasksTotal: 180,
        siteCoverage: health === "HEALTHY" ? 92 : health === "AT_RISK" ? 78 : 65,
        qcInspections: health === "HEALTHY" ? 45 : health === "AT_RISK" ? 38 : 32,
        qcPassed: health === "HEALTHY" ? 43 : health === "AT_RISK" ? 34 : 26,
      };
    case "QC_HANDOVER":
      return {
        documentationProgress: health === "HEALTHY" ? 95 : health === "AT_RISK" ? 80 : 65,
        handoverReadiness: health === "HEALTHY" ? 100 : health === "AT_RISK" ? 85 : 70,
      };
    default:
      return {};
  }
}
