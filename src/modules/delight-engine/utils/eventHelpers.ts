/**
 * Event Helpers
 * Utility functions for mapping event types to icons and colors
 */

import {
  Target,
  ShieldCheck,
  CalendarCheck,
  GraduationCap,
  Heart,
  Award,
  TrendingUp,
  Clock,
  FileCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { DelightEventType } from "../types";

export function getEventIcon(iconNameOrType: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    Target,
    ShieldCheck,
    CalendarCheck,
    GraduationCap,
    Heart,
    Award,
    TrendingUp,
    Clock,
    FileCheck,
    Sparkles,
    // Type fallbacks
    milestone: Target,
    quality: ShieldCheck,
    consistency: CalendarCheck,
    learning: GraduationCap,
    peer_thanks: Heart,
  };

  return iconMap[iconNameOrType] || Sparkles;
}

export function getEventAccentColor(type: DelightEventType): {
  bg: string;
  icon: string;
  border: string;
} {
  const colorMap: Record<
    DelightEventType,
    { bg: string; icon: string; border: string }
  > = {
    milestone: {
      bg: "bg-sky-100 dark:bg-sky-900/30",
      icon: "text-sky-700 dark:text-sky-400",
      border: "border-sky-200 dark:border-sky-800",
    },
    quality: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      icon: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    consistency: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      icon: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
    },
    learning: {
      bg: "bg-indigo-100 dark:bg-indigo-900/30",
      icon: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-800",
    },
    peer_thanks: {
      bg: "bg-zinc-100 dark:bg-zinc-900/30",
      icon: "text-zinc-700 dark:text-zinc-400",
      border: "border-zinc-200 dark:border-zinc-800",
    },
  };

  return colorMap[type];
}

export function getEventTypeLabel(type: DelightEventType): string {
  const labelMap: Record<DelightEventType, string> = {
    milestone: "Milestone",
    quality: "Quality",
    consistency: "Consistency",
    learning: "Learning",
    peer_thanks: "Peer Recognition",
  };

  return labelMap[type];
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}
