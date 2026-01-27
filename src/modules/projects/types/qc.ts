// ⚠️ BACKEND CONTRACT: Do not modify these types without backend coordination
//
// This file defines the core QC domain for a project. The UI in
// `/projects/[projectId]/qc` is built against these types so that it can be
// wired to real APIs later without structural changes.

import type { ProductCategory } from "./build";

export type QCStatus = "PENDING" | "PASSED" | "FAILED";

export interface QCCheck {
  id: string;
  projectId: string;
  /** Product category as defined in the project build module */
  productCategory: ProductCategory;
  /** Human-readable description of the QC check */
  description: string;
  status: QCStatus;
  /** Optional audit fields – who checked and when */
  checkedBy?: string;
  /** ISO timestamp string when this check was last updated */
  checkedAt?: string;
  /** Free-form remark or observation recorded during QC */
  remark?: string;
  /** Snag ids that were raised off the back of this check */
  linkedSnagIds?: string[];
}

export type SnagSeverity = "LOW" | "MEDIUM" | "HIGH";

export type SnagStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type SnagType = "SNAG" | "SYSTEM";

export interface Snag {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  /** Whether this is a physical snag or a system / software issue */
  type: SnagType;
  productCategory?: ProductCategory;
  /** Optional room / area label for quick reference */
  roomName?: string;
  /** Optional linkage back to the originating QC check */
  linkedQCCheckId?: string;
  severity: SnagSeverity;
  status: SnagStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QCDocument {
  id: string;
  title: string;
  description?: string;
  kind:
    | "QC_SIGN_OFF"
    | "CLIENT_HANDOVER"
    | "USER_MANUALS"
    | "PASSWORD_ACK"
    | "SYSTEM_ARCH_SUMMARY";
  /** Whether the document is internal-only (not client facing) */
  internalOnly?: boolean;
}

export interface QCReportSummary {
  projectId: string;
  totalChecks: number;
  passed: number;
  failed: number;
  pending: number;
  openSnags: number;
  finalStatus: "READY_FOR_HANDOVER" | "BLOCKED" | "IN_PROGRESS";
  generatedAt: string;
  generatedBy: string;
}
