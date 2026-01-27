"use client";

import { FileText, Download, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { QCDocument } from "@/modules/projects/types";

interface QCDocumentsTabProps {
  documents: QCDocument[];
}

export function QCDocumentsTab({ documents }: QCDocumentsTabProps) {
  const handleView = (doc: QCDocument) => {
    // BACKEND NOTE: open viewer for /api/projects/[id]/qc/documents/[docId]/view
    console.info("View QC document", doc.id);
  };

  const handleDownload = async (doc: QCDocument) => {
    // BACKEND NOTE: trigger file download from /api/projects/[id]/qc/documents/[docId]/download
    console.info("Download QC document", doc.id);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Card
          key={doc.id}
          className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 flex flex-col"
        >
          <CardHeader className="flex flex-row items-start gap-3 pb-3">
            <div className="mt-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 p-2">
              <FileText className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {doc.title}
              </CardTitle>
              {doc.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {doc.description}
                </p>
              )}
              {doc.internalOnly && (
                <p className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
                  Internal – not shared with client
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="mt-auto flex items-center justify-between gap-2 pt-0 pb-3 px-4">
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Placeholder PDF – backend will attach final document
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleView(doc)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDownload(doc)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
