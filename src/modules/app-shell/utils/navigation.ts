"use client";

import { usePathname } from "next/navigation";
import {
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  ListChecks,
  MessageCircle,
  Settings2,
  ShieldCheck,
  StickyNote,
  Users,
} from "lucide-react";
import type { NavItem } from "../types";
import type { UserRole } from "@/modules/auth/types";

// Map conceptual roles to existing backend roles
// ADMIN -> "admin"
// SITE_SUPERVISOR -> "supervisor"
// TECHNICIAN -> "technician"
// PROGRAMMER -> "programmer"
// QC -> "qc"
// STORE -> "store"

const ADMIN_ROLES: UserRole[] = ["admin"];
const REPORT_ROLES: UserRole[] = ["admin", "supervisor"]; // ADMIN + SITE_SUPERVISOR

// Base workspace items use :projectId as placeholder - will be replaced dynamically
export const workspaceNavItems: NavItem[] = [
  { label: "Overview", href: "/projects/:projectId/overview", icon: Home },
  { label: "Build", href: "/projects/:projectId/build", icon: Settings2 },
  { label: "BOQ", href: "/projects/:projectId/boq", icon: FileText },
  { label: "Tasks", href: "/projects/:projectId/tasks", icon: ListChecks },
  { label: "QC", href: "/projects/:projectId/qc", icon: ShieldCheck },
  { label: "Notes", href: "/projects/:projectId/notes", icon: StickyNote },
  { label: "Activity", href: "/projects/:projectId/activity", icon: Users },
];

export const primaryNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    // children are now handled dynamically in AppShell
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
    roles: REPORT_ROLES,
  },
  {
    label: "Admin Panel",
    href: "/admin",
    icon: Settings2,
    roles: ADMIN_ROLES,
  },
];

export function useActivePath() {
  const pathname = usePathname();
  
  // Extract projectId from pathname if we're in a project context
  const projectIdMatch = pathname?.match(/\/projects\/([^/]+)/);
  const currentProjectId = projectIdMatch ? projectIdMatch[1] : null;
  
  return {
    pathname,
    currentProjectId,
    isActive: (href: string) => {
      if (!pathname) return false;
      if (href === "/") return pathname === "/";
      // Handle dynamic project routes
      const normalizedHref = href.replace(":projectId", currentProjectId || "");
      return pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);
    },
  };
}

// Helper to get workspace items with actual project ID
export function getWorkspaceItemsForProject(projectId: string | null): NavItem[] {
  if (!projectId) return [];
  return workspaceNavItems.map((item) => ({
    ...item,
    href: item.href.replace(":projectId", projectId),
  }));
}

export function filterNavByRole(items: NavItem[], role: UserRole | null): NavItem[] {
  return items
    .filter((item) => {
      if (!item.roles || !role) return !item.roles; // if item has roles and no role, hide it
      return item.roles.includes(role);
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterNavByRole(item.children, role) : undefined,
    }));
}
