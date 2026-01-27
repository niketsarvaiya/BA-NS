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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "build", label: "Build", icon: Hammer },
  { id: "boq", label: "BOQ", icon: FileText },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  // Visits are already integrated into Activity – hide this tab for V1.
  // { id: "visits", label: "Visits", icon: Users },
  { id: "qc", label: "QC", icon: ShieldCheck },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "activity", label: "Activity", icon: Activity },
  // Files depend on Google Drive – keep hidden for V1.
  // { id: "files", label: "Files", icon: FolderOpen },
  // Chat lives in the fixed right-side panel – keep this tab hidden for V1.
  // { id: "chat", label: "Chat", icon: MessageCircle },
];

export function ProjectTabs() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.projectId as string;

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
    <div className="border-b border-zinc-300 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/40">
      <div className="overflow-x-auto scrollbar-hide">
        <nav className="flex gap-1 px-4 min-w-max" role="tablist">
          {TABS.map((tab) => {
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
                  "group relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                  "hover:text-zinc-800 dark:text-zinc-100",
                  isActive
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-400 dark:text-zinc-400"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-colors",
                  isActive ? "text-primary" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-300"
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
