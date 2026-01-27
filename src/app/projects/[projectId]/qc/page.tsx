"use client";

import { useMemo, useState } from "react";
import {
  ClipboardList,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { QCHeaderSummary } from "@/modules/projects/components/qc/QCHeaderSummary";
import { QCChecklistTab } from "@/modules/projects/components/qc/QCChecklistTab";
import { QCSnagsTab } from "@/modules/projects/components/qc/QCSnagsTab";
import { QCDocumentsTab } from "@/modules/projects/components/qc/QCDocumentsTab";
import { QCReportsTab } from "@/modules/projects/components/qc/QCReportsTab";
import type { QCCheck, Snag, QCDocument } from "@/modules/projects/types";
import {
  getMockQCChecks,
  getMockSnags,
  getMockQCDocuments,
} from "@/modules/projects/utils/mockQCData";
import { getProjectById } from "@/modules/projects/utils/mockData";

// When backend wiring is added, mock generators below should be replaced with
// API calls scoped to the current project id.
const FALLBACK_PROJECT_ID = "proj-002";

interface QCPageProps {
  params: {
    projectId: string;
  };
}

export default function QCPage({ params }: QCPageProps) {
  const projectId = params?.projectId ?? FALLBACK_PROJECT_ID;

  const project = getProjectById(projectId) ?? getProjectById(FALLBACK_PROJECT_ID);

  const [checks, setChecks] = useState<QCCheck[]>(() =>
    getMockQCChecks(projectId)
  );
  const [snags, setSnags] = useState<Snag[]>(() => getMockSnags(projectId));
  const [documents] = useState<QCDocument[]>(() =>
    getMockQCDocuments(projectId)
  );

  const summary = useMemo(() => {
    const total = checks.length;
    const passed = checks.filter((c) => c.status === "PASSED").length;
    const failed = checks.filter((c) => c.status === "FAILED").length;
    const pending = checks.filter((c) => c.status === "PENDING").length;
    const openSnags = snags.filter(
      (s) => s.status === "OPEN" || s.status === "IN_PROGRESS"
    ).length;

    return { total, passed, failed, pending, openSnags };
  }, [checks, snags]);

  const handleUpdateCheck = (checkId: string, patch: Partial<QCCheck>) => {
    setChecks((current) =>
      current.map((check) =>
        check.id === checkId ? { ...check, ...patch } : check
      )
    );
  };

  const handleUpdateSnag = (snagId: string, patch: Partial<Snag>) => {
    setSnags((current) =>
      current.map((snag) => (snag.id === snagId ? { ...snag, ...patch } : snag))
    );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-4 md:space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Quality Control
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Final QC gate before handover for
          {" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {project?.name ?? "this project"}
          </span>
          .
        </p>
      </header>

      <QCHeaderSummary
        totalChecks={summary.total}
        passed={summary.passed}
        failed={summary.failed}
        pending={summary.pending}
        openSnags={summary.openSnags}
      />

      <Card className="border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70">
        <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 px-4 pt-3">
          <Tabs defaultValue="checklist" className="w-full">
            <TabsList className="bg-transparent p-0 h-auto gap-1">
              <TabsTrigger
                value="checklist"
                className="data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-50 data-[state=active]:shadow-none text-xs md:text-sm px-3 py-1.5 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-3.5 w-3.5" />
                  <span>QC Checklist</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="snags"
                className="data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-50 data-[state=active]:shadow-none text-xs md:text-sm px-3 py-1.5 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Snag list & issues</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-50 data-[state=active]:shadow-none text-xs md:text-sm px-3 py-1.5 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Documents</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-50 data-[state=active]:shadow-none text-xs md:text-sm px-3 py-1.5 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Reports</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="pt-4 pb-4">
              <TabsContent value="checklist" className="mt-0">
                <QCChecklistTab checks={checks} onUpdateCheck={handleUpdateCheck} />
              </TabsContent>

              <TabsContent value="snags" className="mt-0">
                <QCSnagsTab snags={snags} onUpdateSnag={handleUpdateSnag} />
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <QCDocumentsTab documents={documents} />
              </TabsContent>

              <TabsContent value="reports" className="mt-0">
                <QCReportsTab projectName={project?.name} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
