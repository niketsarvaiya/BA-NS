"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Hammer,
  FileText,
  ListChecks,
  Users,
  ShieldCheck,
  StickyNote,
  Activity,
  FolderOpen,
  MessageCircle,
  ClipboardList,
  Wrench,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth/context/AuthContext";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Roles that see this tab. If omitted, all roles see it. */
  roles?: string[];
  /** Roles that should NOT see this tab. */
  hideForRoles?: string[];
}

const FIELD_ROLES = ["technician", "programmer", "qc"];
const OFFICE_ROLES = ["admin", "supervisor", "store"];

const ALL_TABS: Tab[] = [
  // Shared - Always first
  { id: "overview", label: "Overview", icon: LayoutDashboard },

  // Office-only: Build
  { id: "build", label: "Build", icon: Hammer, hideForRoles: FIELD_ROLES },

  // BOQ - shared
  { id: "boq", label: "BOQ", icon: FileText },

  // Role-based task tabs for admin/supervisor
  { id: "pm-tasks", label: "PM Tasks", icon: ClipboardList, roles: ["admin", "supervisor"] },
  { id: "installer-tasks", label: "Installer Tasks", icon: Wrench, roles: ["admin", "supervisor"] },
  { id: "programmer-tasks", label: "Programmer Tasks", icon: Code2, roles: ["admin", "supervisor"] },
  { id: "qc-tasks", label: "QC Tasks", icon: ShieldCheck, roles: ["admin", "supervisor"] },

  // Field-only: Site Tasks
  { id: "field", label: "Site Tasks", icon: ListChecks, roles: FIELD_ROLES },

  // Shared
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "files", label: "Files", icon: FolderOpen },
];

export function ProjectTabs() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuth();
  const projectId = params.projectId as string;
  const role = user?.role ?? null;

  const visibleTabs = ALL_TABS.filter((tab) => {
    if (tab.roles && role && !tab.roles.includes(role)) return false;
    if (tab.hideForRoles && role && tab.hideForRoles.includes(role)) return false;
    return true;
  });

  const getActiveTab = (): string => {
    if (!pathname) return "overview";
    const segments = pathname.split("/");
    const lastSegment = segments[segments.length - 1];
    return lastSegment || "overview";
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tabId: string) => {
    router.push(`/projects/${projectId}/${tabId}`);
  };

  return (
    <div className="border-b border-border bg-muted/30">
      <div className="overflow-x-auto scrollbar-hide">
        <nav className="flex gap-1 px-4 min-w-max" role="tablist">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-smooth",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-smooth",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span>{tab.label}</span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
