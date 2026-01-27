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
    children: [
      { label: "Project Dashboard", href: "/projects/dashboard", icon: Home },
      { label: "Build", href: "/projects/build", icon: Settings2 },
      { label: "BOQ", href: "/projects/boq", icon: FileText },
      { label: "Tasks", href: "/projects/tasks", icon: ListChecks },
      // Visits moved into Activity for V1 – keep config commented for future reuse.
      // { label: "Visits", href: "/projects/visits", icon: Users },
      { label: "QC", href: "/projects/qc", icon: ShieldCheck },
      { label: "Notes", href: "/projects/notes", icon: StickyNote },
      { label: "Activity", href: "/projects/activity", icon: Users },
      // Files depends on Google Drive integration – hidden for V1.
      // { label: "Files", href: "/projects/files", icon: FileText },
      // Chat lives as a fixed right-side panel – sidebar entry hidden for V1.
      // { label: "Chat", href: "/projects/chat", icon: MessageCircle },
    ],
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
  return {
    pathname,
    isActive: (href: string) => {
      if (!pathname) return false;
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
  };
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
