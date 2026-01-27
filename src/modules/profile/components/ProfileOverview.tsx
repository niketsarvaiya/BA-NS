"use client";

import { useAuth } from "@/modules/auth/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileBadgesSection } from "./ProfileBadgesSection";
import { Mail, MapPin, Briefcase, Hash, ShieldCheck } from "lucide-react";
import { DelightFeed } from "@/modules/delight-engine/components/DelightFeed";
import { useDelightEngine } from "@/modules/delight-engine/context/DelightEngineContext";
import { useTheme } from "@/providers/ThemeProvider";

export function ProfileOverview() {
  const { user } = useAuth();
  const { delightEvents, markAsSeen } = useDelightEngine();
  const { theme, setTheme } = useTheme();

  const displayName = user?.name ?? "Team Member";
  const role = user?.role ?? "Operations";
  const email = user?.username ? `${user.username}@beyond.local` : "team.member@beyond.local";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2563EB&color=FFFFFF&size=128`;
  const employeeCode = `EMP-${user?.id ?? "1023"}`;
  const department = "Operations";
  const location = "Mumbai, MH (placeholder)";
  const isAdminView = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Page header */}
      <section>
        <h1 className="text-page-title text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-body text-muted-foreground max-w-2xl">
          Internal view of who this person is in the context of work, responsibility, and
          execution.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] items-start">
        {/* Left column: identity + personal/work info */}
        <div className="space-y-4">
          {/* Profile header */}
          <Card className="border-border bg-card shadow-sm">
            <div className="flex flex-col gap-4 p-4 md:p-5 md:flex-row md:items-center">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <p className="truncate text-lg font-semibold text-foreground">
                    {displayName}
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>{role}</span>
                  </span>
                  {isAdminView && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3 w-3" />
                      <span>System Access</span>
                    </span>
                  )}
                </div>
                <div className="grid gap-2 text-xs text-foreground sm:grid-cols-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{employeeCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{department}</span>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{location}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal / address information (placeholder for now) */}
          <Card className="border-border bg-card shadow-sm">
            <div className="space-y-3 p-4 md:p-5 text-xs text-foreground">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">
                  Personal & Address Information
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground">
                This section will later pull structured data from HR or onboarding systems. For
                now it is a static placeholder.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Base city
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-foreground">
                    Mumbai (placeholder)
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Primary contact
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-foreground">
                    +91-XXXXXXXXXX
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    Communication address
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-foreground">
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

      {/* Preferences */}
      <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] items-start">
        <Card className="border-border bg-card shadow-sm">
          <div className="space-y-3 p-4 md:p-5 text-xs text-foreground">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">Preferences</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Visual mode is stored per user and applies across all screens.
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Interface theme
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-muted p-1 text-[11px]">
                <Button
                  type="button"
                  variant={theme === "calm" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 rounded-full px-3 text-[11px]"
                  onClick={() => setTheme("calm")}
                >
                  Beyond Calm
                </Button>
                <Button
                  type="button"
                  variant={theme === "neo" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 rounded-full px-3 text-[11px]"
                  onClick={() => setTheme("neo")}
                >
                  Beyond Neo
                </Button>
              </div>
            </div>
          </div>
        </Card>
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
