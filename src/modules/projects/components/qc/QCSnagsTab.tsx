"use client";

import { useState } from "react";
import { AlertTriangle, Bug, CheckCircle2, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";
import type { Snag, SnagSeverity, SnagStatus } from "@/modules/projects/types";
import { getProductCategoryLabel } from "@/modules/projects/utils/mockQCData";

interface QCSnagsTabProps {
  snags: Snag[];
  onUpdateSnag: (snagId: string, patch: Partial<Snag>) => void;
}

export function QCSnagsTab({ snags, onUpdateSnag }: QCSnagsTabProps) {
  const [selectedSnag, setSelectedSnag] = useState<Snag | null>(null);
  const [showClosed, setShowClosed] = useState(false);

  const openSnags = snags.filter((s) => s.status === "OPEN" || s.status === "IN_PROGRESS");
  const systemIssues = snags.filter((s) => s.type === "SYSTEM");
  const closedSnags = snags.filter((s) => s.status === "RESOLVED" || s.status === "CLOSED");

  const handleStatusChange = (snag: Snag, status: SnagStatus) => {
    // BACKEND NOTE: replace with PATCH /api/projects/[id]/qc/snags/[snagId]
    onUpdateSnag(snag.id, {
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4">
      {/* Open Snags */}
      <Card className="border-amber-500/40 bg-amber-50/60 dark:border-amber-500/40 dark:bg-amber-950/30">
        <div className="flex items-start justify-between gap-3 px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-300 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                Open snags blocking handover
              </h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-200/80">
                All open snags must be resolved before this project can be marked ready for handover.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-amber-500/60 text-amber-800 dark:text-amber-100">
            {openSnags.length} open
          </Badge>
        </div>

        <div className="border-t border-amber-200/70 dark:border-amber-900/40 divide-y divide-amber-100/70 dark:divide-amber-900/40">
          {openSnags.map((snag) => (
            <SnagRow
              key={snag.id}
              snag={snag}
              onClick={() => setSelectedSnag(snag)}
              onStatusChange={handleStatusChange}
            />
          ))}

          {openSnags.length === 0 && (
            <div className="px-4 py-6 text-sm text-amber-800/80 dark:text-amber-100/80">
              No open snags at the moment.
            </div>
          )}
        </div>
      </Card>

      {/* System issues */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <Bug className="h-4 w-4 text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Bugs & system issues
          </h3>
          <Badge variant="outline" className="ml-auto text-xs">
            {systemIssues.length}
          </Badge>
        </div>
        <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          {systemIssues.map((snag) => (
            <SnagRow
              key={snag.id}
              snag={snag}
              onClick={() => setSelectedSnag(snag)}
              onStatusChange={handleStatusChange}
            />
          ))}

          {systemIssues.length === 0 && (
            <div className="px-4 py-6 text-sm text-zinc-500 dark:text-zinc-400">
              No system issues logged.
            </div>
          )}
        </div>
      </Card>

      {/* Closed / resolved */}
      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
        <button
          type="button"
          onClick={() => setShowClosed((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Closed / resolved
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {closedSnags.length} item{closedSnags.length === 1 ? "" : "s"}
            </span>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {showClosed ? "Hide" : "Show"}
          </span>
        </button>

        {showClosed && (
          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            {closedSnags.map((snag) => (
              <SnagRow
                key={snag.id}
                snag={snag}
                onClick={() => setSelectedSnag(snag)}
                onStatusChange={handleStatusChange}
              />
            ))}

            {closedSnags.length === 0 && (
              <div className="px-4 py-6 text-sm text-zinc-500 dark:text-zinc-400">
                No closed snags yet.
              </div>
            )}
          </div>
        )}
      </Card>

      {selectedSnag && (
        <SnagDetailPanel
          snag={selectedSnag}
          onClose={() => setSelectedSnag(null)}
        />
      )}
    </div>
  );
}

interface SnagRowProps {
  snag: Snag;
  onClick: () => void;
  onStatusChange: (snag: Snag, status: SnagStatus) => void;
}

function SnagRow({ snag, onClick, onStatusChange }: SnagRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {snag.title}
          </p>
          <SeverityBadge severity={snag.severity} />
          <StatusBadge status={snag.status} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          {snag.productCategory && (
            <span>{getProductCategoryLabel(snag.productCategory)}</span>
          )}
          {snag.roomName && (
            <span className="text-zinc-400 dark:text-zinc-500">• {snag.roomName}</span>
          )}
          {snag.assignedTo && (
            <span className="text-zinc-400 dark:text-zinc-500">• Assigned to {snag.assignedTo}</span>
          )}
          <span className="text-zinc-400 dark:text-zinc-500">
            • Created {new Date(snag.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-xs">
        {(snag.status === "OPEN" || snag.status === "IN_PROGRESS") && (
          <div className="flex gap-1">
            <Button
              size="xs" // @ts-expect-error: xs size not yet typed, but supported in Button styles
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(snag, "RESOLVED");
              }}
            >
              Resolve
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(snag, "CLOSED");
              }}
            >
              Close
            </Button>
          </div>
        )}
        <span className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500">
          <MessageCircle className="h-3 w-3" />
          2 comments
        </span>
      </div>
    </button>
  );
}

interface SeverityBadgeProps {
  severity: SnagSeverity;
}

function SeverityBadge({ severity }: SeverityBadgeProps) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";

  if (severity === "HIGH") {
    return (
      <span className={`${base} bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900`}>
        High
      </span>
    );
  }
  if (severity === "MEDIUM") {
    return (
      <span className={`${base} bg-amber-50 text-amber-800 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-200 dark:border-amber-900`}>
        Medium
      </span>
    );
  }
  return (
    <span className={`${base} bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800`}>
      Low
    </span>
  );
}

interface StatusBadgeProps {
  status: SnagStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium";

  if (status === "OPEN") {
    return (
      <span className={`${base} bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900`}>
        Open
      </span>
    );
  }
  if (status === "IN_PROGRESS") {
    return (
      <span className={`${base} bg-amber-50 text-amber-800 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-200 dark:border-amber-900`}>
        In progress
      </span>
    );
  }
  if (status === "RESOLVED") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900`}>
        Resolved
      </span>
    );
  }
  return (
    <span className={`${base} bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800`}>
      Closed
    </span>
  );
}

interface SnagDetailPanelProps {
  snag: Snag;
  onClose: () => void;
}

function SnagDetailPanel({ snag, onClose }: SnagDetailPanelProps) {
  const iconElement = (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/20">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-300" />
    </div>
  );

  return (
    <DetailPanel
      isOpen={true}
      onClose={onClose}
      title={snag.title}
      subtitle={snag.type === "SYSTEM" ? "System issue" : "Site snag"}
      icon={iconElement}
      width="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <DetailPanelSection title="Severity">
            <SeverityBadge severity={snag.severity} />
          </DetailPanelSection>
          <DetailPanelSection title="Status">
            <StatusBadge status={snag.status} />
          </DetailPanelSection>
        </div>

        {snag.description && (
          <DetailPanelSection title="Description">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{snag.description}</p>
          </DetailPanelSection>
        )}

        <DetailPanelSection title="Linked items">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {snag.productCategory && (
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Product category
                </div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {getProductCategoryLabel(snag.productCategory)}
                </div>
              </div>
            )}
            {snag.roomName && (
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Room / area
                </div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {snag.roomName}
                </div>
              </div>
            )}
            {snag.linkedQCCheckId && (
              <div className="col-span-2">
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                  Linked QC check
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300">
                  QC Check ID: <span className="font-mono text-[11px]">{snag.linkedQCCheckId}</span>
                </div>
              </div>
            )}
          </div>
        </DetailPanelSection>

        <DetailPanelSection title="Images">
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-zinc-300 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400">
            Image capture placeholder (site photos, screenshots, etc.)
          </div>
        </DetailPanelSection>

        <DetailPanelSection title="Comments">
          <div className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <p>
              • <span className="font-medium text-zinc-700 dark:text-zinc-200">QC – Anjali</span>: Logged during final walkthrough.
            </p>
            <p>
              • <span className="font-medium text-zinc-700 dark:text-zinc-200">Contractor</span>: Rectification scheduled for next site visit.
            </p>
          </div>
        </DetailPanelSection>
      </div>
    </DetailPanel>
  );
}
