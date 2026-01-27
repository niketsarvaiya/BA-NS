"use client";

import * as React from "react";
import {
  GraduationCap,
  ClipboardList,
  Clock3,
  ShieldCheck,
  Award,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BadgeCategory, ProfileBadgeGroup, ProfileBadge } from "../types";
import { MOCK_PROFILE_BADGE_GROUPS } from "../utils/mockProfileBadges";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CATEGORY_ACCENTS: Record<
  BadgeCategory,
  {
    icon: string;
  }
> = {
  TENURE_COMMITMENT: {
    // muted gold
    icon: "text-amber-600 dark:text-amber-400",
  },
  EXECUTION_DELIVERY: {
    // steel blue
    icon: "text-sky-700 dark:text-sky-400",
  },
  SKILLS_CERTIFICATIONS: {
    // indigo
    icon: "text-indigo-700 dark:text-indigo-400",
  },
  QUALITY_COMPLIANCE: {
    // green
    icon: "text-emerald-700 dark:text-emerald-400",
  },
  CULTURE_LEADERSHIP: {
    // neutral grey
    icon: "text-zinc-600 dark:text-zinc-300",
  },
};

function getCategoryIcon(category: BadgeCategory): React.ReactNode {
  switch (category) {
    case "TENURE_COMMITMENT":
      return <GraduationCap className="h-4 w-4" />;
    case "EXECUTION_DELIVERY":
      return <ClipboardList className="h-4 w-4" />;
    case "SKILLS_CERTIFICATIONS":
      return <GraduationCap className="h-4 w-4" />;
    case "QUALITY_COMPLIANCE":
      return <ShieldCheck className="h-4 w-4" />;
    case "CULTURE_LEADERSHIP":
      return <Clock3 className="h-4 w-4" />;
    default:
      return <Award className="h-4 w-4" />;
  }
}

interface ProfileBadgesSectionProps {
  groups?: ProfileBadgeGroup[];
  /** If true, show all badges as unlocked and surface system label */
  isAdminView?: boolean;
}

interface BadgeCardProps {
  badge: ProfileBadge;
  accentIconClass: string;
  locked: boolean;
}

function BadgeCard({ badge, accentIconClass, locked }: BadgeCardProps) {
  const effectiveOpacity = locked ? "opacity-40" : "opacity-100";

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "relative group flex h-full w-full flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left",
              "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/80",
              !locked && "hover:border-zinc-300 dark:hover:border-zinc-700",
              effectiveOpacity
            )}
          >
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200",
                accentIconClass
              )}
            >
              <Award className="h-3.5 w-3.5" />
            </span>
            <div className="mt-1 flex flex-col min-w-0">
              <span className="line-clamp-2 break-words text-[13px] font-medium text-zinc-900 dark:text-zinc-50">
                {badge.name}
              </span>
              <span className="mt-0.5 line-clamp-1 break-words text-[11px] text-zinc-500 dark:text-zinc-400">
                {badge.subtitle}
              </span>
            </div>
            <span className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500 break-words">
              Earned {formatDate(badge.earnedAt)} &bull; {badge.issuedBy}
            </span>

            {locked && (
              <span className="pointer-events-none absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-100 shadow-sm">
                <Lock className="h-3 w-3" />
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs text-xs leading-snug">
          <p className="mb-1 font-medium text-zinc-100">{badge.name}</p>
          <p className="mb-1 text-[11px] text-zinc-200">{badge.description}</p>
          <p className="mb-1 text-[11px] text-zinc-200">
            <span className="font-medium">Why it matters:</span> {badge.whyItMatters}
          </p>
          <p className="text-[11px] text-zinc-300">
            <span className="font-medium">How earned:</span> {badge.howEarned}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400">
            Earned on {formatDate(badge.earnedAt)} &bull; Issued by {badge.issuedBy}
          </p>
          {locked && (
            <p className="mt-1 text-[11px] text-zinc-400">
              Unlocked after meeting criteria.
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ProfileBadgesSection({
  groups = MOCK_PROFILE_BADGE_GROUPS,
  isAdminView = false,
}: ProfileBadgesSectionProps) {
  const allBadges = groups.flatMap((g) => g.badges);
  const heroBadges = allBadges.filter((b) => b.isHero).slice(0, 5);

  const groupedWithoutHeroes: ProfileBadgeGroup[] = groups.map((group) => ({
    ...group,
    badges: group.badges.filter((b) => !b.isHero),
  }));

  return (
    <Card className="h-full border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm">
      <div className="flex items-start justify-between gap-2 border-b border-zinc-200/80 px-4 py-3 text-xs text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-300">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Badges & Achievements
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            Your professional footprint at Beyond. Internal, factual signals of training,
            execution, and quality.
          </p>
        </div>
        {isAdminView && (
          <div className="ml-2 rounded-full bg-zinc-900/80 px-2.5 py-1 text-[10px] font-medium text-zinc-100">
            🛡 System View Enabled
          </div>
        )}
      </div>

      <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
        {/* Hero highlight strip */}
        <div className="px-4 py-3">
          {heroBadges.length === 0 ? (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Key badges will appear here as this profile evolves.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {heroBadges.map((badge) => {
                const accent = CATEGORY_ACCENTS[badge.category];
                const locked = !isAdminView && badge.locked;
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      "relative flex flex-col gap-2 rounded-xl border bg-white px-3 py-3 text-left text-xs",
                      "border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/80",
                      !locked && "shadow-sm",
                      locked && "opacity-40"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900",
                          accent.icon
                        )}
                      >
                        {getCategoryIcon(badge.category)}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="line-clamp-2 break-words text-sm font-medium text-zinc-900 dark:text-zinc-50">
                          {badge.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 break-words">
                          {badge.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 break-words">
                      Earned {formatDate(badge.earnedAt)}
                    </p>
                    {locked && (
                      <span className="pointer-events-none absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/80 text-zinc-100 shadow-sm">
                        <Lock className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category sections */}
        <div className="px-4 py-3 space-y-4">
          {groupedWithoutHeroes.map((group) => {
            const firstBadge = group.badges[0];
            const accent = firstBadge
              ? CATEGORY_ACCENTS[firstBadge.category]
              : CATEGORY_ACCENTS.TENURE_COMMITMENT;

            return (
              <section key={group.id} className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-900",
                      accent.icon
                    )}
                  >
                    {getCategoryIcon(group.id)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium uppercase tracking-wide">
                      {group.label}
                    </span>
                    <span className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {group.description}
                    </span>
                  </div>
                </div>

                {group.badges.length === 0 ? (
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    No badges in this category yet.
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {group.badges.map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        badge={badge}
                        accentIconClass={accent.icon}
                        locked={!isAdminView && badge.locked}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
