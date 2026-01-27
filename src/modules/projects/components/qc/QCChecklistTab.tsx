"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { QCCheck, QCStatus } from "@/modules/projects/types";
import type { ProductCategory } from "@/modules/projects/types/build";
import { getProductCategoryLabel } from "@/modules/projects/utils/mockQCData";

interface QCChecklistTabProps {
  checks: QCCheck[];
  onUpdateCheck: (checkId: string, patch: Partial<QCCheck>) => void;
}

export function QCChecklistTab({ checks, onUpdateCheck }: QCChecklistTabProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [remarkForCheck, setRemarkForCheck] = useState<QCCheck | null>(null);
  const [remarkDraft, setRemarkDraft] = useState<string>("");

  const grouped = checks.reduce<Record<string, QCCheck[]>>((acc, check) => {
    const key = check.productCategory;
    if (!acc[key]) acc[key] = [];
    acc[key].push(check);
    return acc;
  }, {});

  const handleToggleCategory = (category: string) => {
    setExpandedCategory((current) => (current === category ? null : category));
  };

  const handleStatusChange = (check: QCCheck, status: QCStatus) => {
    // BACKEND NOTE: replace with PATCH /api/projects/[id]/qc/checks/[checkId]
    onUpdateCheck(check.id, {
      status,
      checkedBy: "QC – Auto (mock)",
      checkedAt: new Date().toISOString(),
    });
  };

  const openRemarkDialog = (check: QCCheck) => {
    setRemarkForCheck(check);
    setRemarkDraft(check.remark ?? "");
  };

  const handleSaveRemark = () => {
    if (!remarkForCheck) return;
    // BACKEND NOTE: replace with PATCH /api/projects/[id]/qc/checks/[checkId]/remark
    onUpdateCheck(remarkForCheck.id, {
      remark: remarkDraft.trim() || undefined,
    });
    setRemarkForCheck(null);
    setRemarkDraft("");
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
      <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
        {Object.entries(grouped).map(([category, categoryChecks]) => {
          const isExpanded = expandedCategory === category;

          const passed = categoryChecks.filter((c) => c.status === "PASSED").length;
          const failed = categoryChecks.filter((c) => c.status === "FAILED").length;
          const pending = categoryChecks.filter((c) => c.status === "PENDING").length;

          return (
            <section key={category}>
              <button
                type="button"
                onClick={() => handleToggleCategory(category)}
                className="flex w-full items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              >
                <div className="flex items-center gap-3 text-left">
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 transition-transform ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {getProductCategoryLabel(category as ProductCategory)}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {categoryChecks.length} QC check
                      {categoryChecks.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="border-emerald-500/60 text-emerald-700 dark:text-emerald-300">
                    Passed: {passed}
                  </Badge>
                  <Badge variant="outline" className="border-red-500/60 text-red-700 dark:text-red-300">
                    Failed: {failed}
                  </Badge>
                  <Badge variant="outline" className="border-zinc-300/80 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
                    Pending: {pending}
                  </Badge>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/40">
                  {categoryChecks.map((check) => (
                    <div
                      key={check.id}
                      className="flex flex-col gap-2 px-4 py-3 border-b last:border-b-0 border-zinc-200/70 dark:border-zinc-800/70 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {check.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                          <StatusPill status={check.status} />
                          {check.checkedBy && (
                            <span>
                              Checked by <span className="font-medium text-zinc-700 dark:text-zinc-200">{check.checkedBy}</span>
                            </span>
                          )}
                          {check.checkedAt && (
                            <span className="text-zinc-400 dark:text-zinc-500">
                              • {new Date(check.checkedAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          )}
                          {check.remark && (
                            <Badge variant="outline" className="border-amber-500/60 text-amber-700 dark:text-amber-200">
                              Remark added
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 md:pt-0">
                        <Button
                          size="sm"
                          variant={check.status === "PASSED" ? "default" : "outline"}
                          className="gap-1.5"
                          onClick={() => handleStatusChange(check, "PASSED")}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Passed
                        </Button>
                        <Button
                          size="sm"
                          variant={check.status === "FAILED" ? "destructive" : "outline"}
                          className="gap-1.5"
                          onClick={() => handleStatusChange(check, "FAILED")}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Failed
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={
                            check.remark
                              ? "text-amber-600 hover:text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950/30"
                              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                          }
                          onClick={() => openRemarkDialog(check)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {checks.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No QC checks are defined for this project yet.
          </div>
        )}
      </div>

      <Dialog open={!!remarkForCheck} onOpenChange={(open) => !open && setRemarkForCheck(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">
              Add remark
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {remarkForCheck?.description}
            </p>
            <Textarea
              rows={4}
              value={remarkDraft}
              onChange={(e) => setRemarkDraft(e.target.value)}
              placeholder="Record any observations, deviations, or specific notes for this QC check."
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setRemarkForCheck(null);
                  setRemarkDraft("");
                }}
              >
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleSaveRemark}>
                Save remark
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface StatusPillProps {
  status: QCStatus;
}

function StatusPill({ status }: StatusPillProps) {
  const base = "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium";

  if (status === "PASSED") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900`}>
        <CheckCircle2 className="h-3 w-3" /> Passed
      </span>
    );
  }

  if (status === "FAILED") {
    return (
      <span className={`${base} bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900`}>
        <XCircle className="h-3 w-3" /> Failed
      </span>
    );
  }

  return (
    <span className={`${base} bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800`}>
      Pending
    </span>
  );
}
