"use client";

import { useAuth } from "@/modules/auth/context/AuthContext";
import { Card } from "@/components/ui/card";
import { ProfileBadgesSection } from "./ProfileBadgesSection";
import { Mail, MapPin, Briefcase, Hash, ShieldCheck } from "lucide-react";
import { DelightFeed } from "@/modules/delight-engine/components/DelightFeed";
import { useDelightEngine } from "@/modules/delight-engine/context/DelightEngineContext";

export function ProfileOverview() {
  const { user } = useAuth();
  const { delightEvents, markAsSeen } = useDelightEngine();

  const displayName = user?.name ?? "Team Member";
  const role = user?.role ?? "Operations";
  const email = user?.username ? `${user.username}@beyond.local` : "team.member@beyond.local";
  const employeeCode = `EMP-${user?.id ?? "1023"}`;
  const department = "Operations";
  const location = "Mumbai, MH (placeholder)";
  const isAdminView = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Profile
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Internal view of who this person is in the context of work, responsibility, and
          execution.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] items-start">
        {/* Left column: identity + personal/work info */}
        <div className="space-y-4">
          {/* Profile header */}
          <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm">
            <div className="flex flex-col gap-4 p-4 md:p-5 md:flex-row md:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-2xl font-semibold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {displayName}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                    <Briefcase className="h-3 w-3" />
                    <span>{role}</span>
                  </span>
                  {isAdminView && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/40 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/60 dark:bg-emerald-900/40 dark:text-emerald-200">
                      <ShieldCheck className="h-3 w-3" />
                      <span>System Access</span>
                    </span>
                  )}
                </div>
                <div className="grid gap-2 text-xs text-zinc-600 dark:text-zinc-300 sm:grid-cols-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{employeeCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{department}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="truncate">{location}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal / address information (placeholder for now) */}
          <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm">
            <div className="space-y-3 p-4 md:p-5 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  Personal & Address Information
                </p>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                This section will later pull structured data from HR or onboarding systems. For
                now it is a static placeholder.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                    Base city
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-100">
                    Mumbai (placeholder)
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                    Primary contact
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-100">
                    +91-XXXXXXXXXX
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
                    Communication address
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-100">
                    Address line placeholder for future integration.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column: badges & achievements */}
        <ProfileBadgesSection isAdminView={isAdminView} />
      </section>

      {/* Recognition feed */}
      <section>
        <DelightFeed
          events={delightEvents}
          showFilters={true}
          onEventClick={(event) => {
            if (!event.seen) {
              markAsSeen(event.id);
            }
          }}
        />
      </section>
    </div>
  );
}
