import { notFound } from "next/navigation";
import { getProjectById } from "@/modules/projects/utils/mockData";
import { getMockDashboardData } from "@/modules/projects/utils/mockDashboardData";
import {
  mapProjectStageToDashboardStage,
  mapProjectHealthToDashboardHealth,
} from "@/modules/projects/utils/stageMapping";
import { STAGE_CONFIGS } from "@/modules/projects/types/dashboard";
import { StageProgressBar } from "@/modules/projects/components/StageProgressBar";
import { TodaysFocus } from "@/modules/projects/components/TodaysFocus";
import { UpcomingMilestones } from "@/modules/projects/components/UpcomingMilestones";

interface ProjectOverviewPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectOverviewPage({
  params,
}: ProjectOverviewPageProps) {
  const { projectId } = await params;
  const project = getProjectById(projectId);

  if (!project) {
    notFound();
  }

  // Map project data to dashboard format
  const dashboardStage = mapProjectStageToDashboardStage(project.stage);
  const dashboardHealth = mapProjectHealthToDashboardHealth(project.health);

  // Get mock dashboard data
  const dashboardData = getMockDashboardData(
    projectId,
    dashboardStage,
    dashboardHealth
  );

  const stageConfig = STAGE_CONFIGS.find((stage) => stage.id === dashboardStage);

  // Define stage-specific primary actions for Today’s Focus
  const getActionButtons = () => {
    switch (dashboardStage) {
      case "DESIGN":
        return [
          { label: "View drawings", variant: "default" as const },
          { label: "Request approval", variant: "outline" as const },
        ];
      case "AUDIT":
        return [
          { label: "Schedule audit", variant: "default" as const },
          { label: "View findings", variant: "outline" as const },
        ];
      case "EXECUTION":
        return [
          { label: "View tasks", variant: "default" as const },
          { label: "Plan site visit", variant: "outline" as const },
        ];
      case "QC_HANDOVER":
        return [
          { label: "QC checklist", variant: "default" as const },
          { label: "Prepare handover", variant: "outline" as const },
        ];
      default:
        return [];
    }
  };

  const hasBlocker =
    dashboardData.openBlockers > 0 && dashboardData.blocker !== null;

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      {/* Section 1: Project state header */}
      <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {project.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              Current stage: <span className="font-medium text-foreground">{stageConfig?.label}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Health indicator */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-500/15 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-semibold">
                {dashboardData.health === "HEALTHY"
                  ? "Healthy"
                  : dashboardData.health === "AT_RISK"
                  ? "At risk"
                  : "Critical"}
              </span>
            </div>

            {/* Days to handover */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300/70 bg-zinc-100/60 px-3 py-1.5 text-zinc-700 dark:border-zinc-700/80 dark:bg-zinc-900/70 dark:text-zinc-200">
              <span className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Handover
              </span>
              <span className="text-xs font-medium">
                {dashboardData.daysToHandover}d
              </span>
            </div>

            {/* Blocker count, only if present */}
            {hasBlocker && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/60 bg-red-500/10 px-3 py-1.5 text-red-700 dark:border-red-500/60 dark:bg-red-500/15 dark:text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-xs font-semibold">
                  {dashboardData.openBlockers}{" "}
                  {dashboardData.openBlockers === 1
                    ? "active blocker"
                    : "active blockers"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <StageProgressBar currentStage={dashboardStage} />
        </div>
      </section>

      {/* Main Grid: execution focus (left/center) and context (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left/center column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Section 2: Today’s Focus */}
          <TodaysFocus
            priorities={dashboardData.priorities}
            blocker={null}
            actionButtons={getActionButtons()}
          />

          {/* Section 3: Active Blockers (conditional) */}
          {hasBlocker && dashboardData.blocker && (
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg border border-red-500/60 bg-red-950/40 px-4 py-3 text-left text-xs text-red-50 transition-colors hover:border-red-400 hover:bg-red-950/60"
            >
              <div className="flex-1 truncate">
                <p className="font-medium truncate">
                  Active blocker: {dashboardData.blocker.title}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-red-200/80">
                  {dashboardData.blocker.description} — Owner: {dashboardData.blocker.owner} · {dashboardData.blocker.daysBlocked}d blocked
                </p>
              </div>
              <span className="ml-3 flex-shrink-0 text-[11px] font-medium text-red-200 underline-offset-2 hover:underline">
                View details
              </span>
            </button>
          )}
        </div>

        {/* Right column: Upcoming milestones */}
        <div className="lg:col-span-1">
          <UpcomingMilestones milestones={dashboardData.milestones} />
        </div>
      </div>
    </div>
  );
}
