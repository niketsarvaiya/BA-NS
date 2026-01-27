import type {
  QCCheck,
  QCDocument,
  Snag,
  SnagSeverity,
  SnagStatus,
} from "../types";
import type { ProductCategory } from "../types/build";

// BACKEND NOTE:
// Replace these mock generators with real API calls:
// - GET /api/projects/[projectId]/qc/checks
// - GET /api/projects/[projectId]/qc/snags
// - GET /api/projects/[projectId]/qc/documents

const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  Controls: "Automation / Controls",
  Lighting: "Lights",
  "Curtains & Blinds": "Curtains & Blinds",
  "Audio Visual": "Audio Visual",
  Security: "Security",
  Networking: "Networking",
  HVAC: "HVAC",
  Other: "Other",
};

export function getProductCategoryLabel(category: ProductCategory): string {
  return PRODUCT_CATEGORY_LABELS[category] ?? category;
}

export function getMockQCChecks(projectId: string): QCCheck[] {
  const base: Array<Omit<QCCheck, "projectId">> = [
    {
      id: "qc-1",
      productCategory: "Lighting",
      description: "All lighting circuits respond correctly to programmed scenes",
      status: "PASSED",
      checkedBy: "QC – Anjali Verma",
      checkedAt: new Date().toISOString(),
    },
    {
      id: "qc-2",
      productCategory: "Lighting",
      description: "Emergency and exit lights function on power failure simulation",
      status: "FAILED",
      checkedBy: "QC – Anjali Verma",
      checkedAt: new Date().toISOString(),
      remark: "2 fixtures on Level 3 not switching to backup supply",
      linkedSnagIds: ["snag-1"],
    },
    {
      id: "qc-3",
      productCategory: "Audio Visual",
      description: "Conference room display, audio, and VC system function end‑to‑end",
      status: "PENDING",
    },
    {
      id: "qc-4",
      productCategory: "Networking",
      description: "Core switches failover tested and logs captured",
      status: "PASSED",
      checkedBy: "QC – Network Team",
      checkedAt: new Date().toISOString(),
    },
    {
      id: "qc-5",
      productCategory: "Security",
      description:
        "All CCTV cameras streaming and recordings retained for 30 days",
      status: "PENDING",
    },
  ];

  return base.map((item) => ({ ...item, projectId }));
}

export function getMockSnags(projectId: string): Snag[] {
  const now = new Date();
  const daysAgo = (d: number) => {
    const copy = new Date(now);
    copy.setDate(copy.getDate() - d);
    return copy.toISOString();
  };

  const base: Array<{
    id: string;
    title: string;
    description?: string;
    type: "SNAG" | "SYSTEM";
    productCategory?: ProductCategory;
    roomName?: string;
    linkedQCCheckId?: string;
    severity: SnagSeverity;
    status: SnagStatus;
    assignedTo?: string;
    createdAt: string;
    updatedAt: string;
  }> = [
    {
      id: "snag-1",
      title: "Emergency lights not switching to backup",
      description:
        "Level 3 corridor – 2 fixtures stay off during DG power simulation.",
      type: "SNAG",
      productCategory: "Lighting",
      roomName: "Level 3 – Corridor",
      linkedQCCheckId: "qc-2",
      severity: "HIGH",
      status: "OPEN",
      assignedTo: "Electrical Contractor",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(1),
    },
    {
      id: "snag-2",
      title: "VC system intermittently drops calls",
      description: "Conference Room A – call drops observed during 30‑minute test.",
      type: "SYSTEM",
      productCategory: "Audio Visual",
      roomName: "Conference Room A",
      linkedQCCheckId: "qc-3",
      severity: "MEDIUM",
      status: "IN_PROGRESS",
      assignedTo: "AV Integrator",
      createdAt: daysAgo(5),
      updatedAt: daysAgo(2),
    },
    {
      id: "snag-3",
      title: "Patch panel labelling cleanup",
      description: "IDF-2 – 6 ports mislabelled; update to final room names.",
      type: "SNAG",
      productCategory: "Networking",
      roomName: "IDF-2",
      severity: "LOW",
      status: "RESOLVED",
      assignedTo: "Networking Team",
      createdAt: daysAgo(10),
      updatedAt: daysAgo(1),
    },
    {
      id: "snag-4",
      title: "Password change acknowledgement pending from client IT",
      description:
        "Client IT to confirm receipt of admin password envelope and change log.",
      type: "SYSTEM",
      severity: "MEDIUM",
      status: "CLOSED",
      assignedTo: "Client IT",
      createdAt: daysAgo(14),
      updatedAt: daysAgo(4),
    },
  ];

  return base.map((item) => ({ ...item, projectId }));
}

export function getMockQCDocuments(projectId: string): QCDocument[] {
  // Note: projectId is currently unused but kept in the signature so that the
  // eventual backend wiring can scope documents per project.
  void projectId;

  return [
    {
      id: "doc-1",
      title: "QC Sign-off Document",
      description:
        "Formal record of all critical QC checks and sign‑offs prior to handover.",
      kind: "QC_SIGN_OFF",
    },
    {
      id: "doc-2",
      title: "Client Handover Document",
      description:
        "Summary of systems handed over, responsibilities, and post‑handover support.",
      kind: "CLIENT_HANDOVER",
    },
    {
      id: "doc-3",
      title: "User Manuals",
      description:
        "Compiled user manuals for all major systems in scope (lighting, AV, security, networking).",
      kind: "USER_MANUALS",
      internalOnly: false,
    },
    {
      id: "doc-4",
      title: "Password Change Acknowledgement",
      description:
        "Record of admin credential rotation and acknowledgement by client IT team.",
      kind: "PASSWORD_ACK",
      internalOnly: true,
    },
    {
      id: "doc-5",
      title: "System Architecture Summary",
      description:
        "High‑level diagram and narrative of the deployed system architecture.",
      kind: "SYSTEM_ARCH_SUMMARY",
      internalOnly: false,
    },
  ];
}
