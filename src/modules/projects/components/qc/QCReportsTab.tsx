"use client";

import { useState } from "react";
import { FileSpreadsheet, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QCReportsTabProps {
  projectName?: string;
}

export function QCReportsTab({ projectName }: QCReportsTabProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    // BACKEND NOTE: replace with POST /api/projects/[id]/qc/report or similar
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setDownloading(false);
    // In a real app, trigger toast/notification here
    console.info("QC report download complete", { projectName });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            QC report for client handover
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Generate a consolidated QC report for the client, architect, and consultant.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download className="h-4 w-4" />
          {downloading ? "Preparing report..." : "Download QC report"}
        </Button>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70">
        <CardHeader className="flex flex-row items-center gap-3 pb-3">
          <div className="mt-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 p-2">
            <FileSpreadsheet className="h-4 w-4 text-zinc-500" />
          </div>
          <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            What the report includes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4 text-xs text-zinc-500 dark:text-zinc-400 space-y-1.5">
          <p>• Project summary and basic information</p>
          <p>• Scope overview mapped to product categories</p>
          <p>• Product-wise QC checklist with pass / fail breakdown</p>
          <p>• Aggregate QC metrics (passed, failed, pending)</p>
          <p>• Detailed list of open snags and system issues</p>
          <p>• Final QC readiness status for handover</p>
        </CardContent>
      </Card>
    </div>
  );
}
