import { FileText, ClipboardCheck, Hammer, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectStage } from "../types/dashboard";

interface StageWidgetsProps {
  stage: ProjectStage;
  data: {
    designApprovalProgress?: number;
    drawingsCompleted?: number;
    drawingsTotal?: number;
    auditScheduled?: boolean;
    auditDate?: string;
    findingsOpen?: number;
    findingsClosed?: number;
    tasksCompleted?: number;
    tasksTotal?: number;
    siteCoverage?: number;
    qcInspections?: number;
    qcPassed?: number;
    documentationProgress?: number;
    handoverReadiness?: number;
  };
}

export function StageWidgets({ stage, data }: StageWidgetsProps) {
  switch (stage) {
    case "DESIGN":
      return <DesignStageWidgets data={data} />;
    case "AUDIT":
      return <AuditStageWidgets data={data} />;
    case "EXECUTION":
      return <ExecutionStageWidgets data={data} />;
    case "QC_HANDOVER":
      return <QCHandoverStageWidgets data={data} />;
    default:
      return null;
  }
}

function DesignStageWidgets({ data }: { data: StageWidgetsProps["data"] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Design Approval Progress */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Design Approval
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.designApprovalProgress || 0}%
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Complete
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all"
              style={{ width: `${data.designApprovalProgress || 0}%` }}
            />
          </div>
          {(data.designApprovalProgress || 0) < 100 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Awaiting client sign-off on remaining drawings
            </p>
          )}
        </div>
      </div>

      {/* Drawings Status */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Drawings Completed
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.drawingsCompleted || 0}/{data.drawingsTotal || 0}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Sheets
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all"
              style={{
                width: `${
                  data.drawingsTotal
                    ? (data.drawingsCompleted! / data.drawingsTotal) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditStageWidgets({ data }: { data: StageWidgetsProps["data"] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Audit Schedule */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Audit Status
          </h4>
        </div>
        {data.auditScheduled ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Audit Scheduled
              </span>
            </div>
            {data.auditDate && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Scheduled for: {data.auditDate}
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              ⚠️ Audit not yet scheduled
            </p>
          </div>
        )}
      </div>

      {/* Findings Resolution */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Findings Resolution
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.findingsClosed || 0}/{(data.findingsClosed || 0) + (data.findingsOpen || 0)}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Resolved
            </span>
          </div>
          {(data.findingsOpen || 0) > 0 && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {data.findingsOpen} open findings require attention
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecutionStageWidgets({ data }: { data: StageWidgetsProps["data"] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Task Completion */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Hammer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Tasks
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.tasksCompleted || 0}/{data.tasksTotal || 0}
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 dark:bg-orange-600 rounded-full transition-all"
              style={{
                width: `${
                  data.tasksTotal
                    ? (data.tasksCompleted! / data.tasksTotal) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Site Coverage */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Site Coverage
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.siteCoverage || 0}%
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 dark:bg-blue-600 rounded-full transition-all"
              style={{ width: `${data.siteCoverage || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* QC Inspections */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            QC Inspections
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.qcPassed || 0}/{data.qcInspections || 0}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Passed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function QCHandoverStageWidgets({ data }: { data: StageWidgetsProps["data"] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Documentation Progress */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Documentation
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.documentationProgress || 0}%
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Complete
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 dark:bg-indigo-600 rounded-full transition-all"
              style={{ width: `${data.documentationProgress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Handover Readiness */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Handover Readiness
          </h4>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.handoverReadiness || 0}%
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Ready
            </span>
          </div>
          <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all"
              style={{ width: `${data.handoverReadiness || 0}%` }}
            />
          </div>
          {(data.handoverReadiness || 0) >= 100 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Ready for handover
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
