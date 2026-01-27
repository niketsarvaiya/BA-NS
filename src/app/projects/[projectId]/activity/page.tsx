"use client";

import { useState, useMemo } from "react";
import { Activity, Plus, Search, Calendar } from "lucide-react";
import { MOCK_ACTIVITIES } from "@/modules/activity/utils/mockActivityData";
import { groupActivitiesByDateAndType } from "@/modules/activity/utils/groupActivitiesByDate";
import { ActivityRow } from "@/modules/activity/components/ActivityRow";
import { ActivityDetailPanel } from "@/modules/activity/components/ActivityDetailPanel";
import type { ActivityType, GroupedActivitiesByType } from "@/modules/activity/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { calculateActivitySummary, ACTIVITY_TYPE_LABELS } from "@/modules/activity/utils/activityHelpers";

// BACKEND NOTE:
// This page will fetch activities from the backend API.
// Activities are generated from system events + manual inputs.
// Replace MOCK_ACTIVITIES with API call.

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );

  // Filter and group activities
  const { groupedActivities, summary } = useMemo(() => {
    const filtered = searchQuery
      ? MOCK_ACTIVITIES.filter(
          (activity) =>
            activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            activity.actor.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : MOCK_ACTIVITIES;

    const grouped = groupActivitiesByDateAndType(filtered);
    const summary = calculateActivitySummary(MOCK_ACTIVITIES);

    return { groupedActivities: grouped, summary };
  }, [searchQuery]);

  const toggleDateGroup = (dateKey: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(dateKey)) {
      newCollapsed.delete(dateKey);
    } else {
      newCollapsed.add(dateKey);
    }
    setCollapsedGroups(newCollapsed);
  };

  const toggleTypeGroup = (dateKey: string, type: ActivityType) => {
    const key = `${dateKey}-${type}`;
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(key)) {
      newCollapsed.delete(key);
    } else {
      newCollapsed.add(key);
    }
    setCollapsedGroups(newCollapsed);
  };

  const selectedActivityData = selectedActivity
    ? MOCK_ACTIVITIES.find((a) => a.id === selectedActivity)
    : null;

  return (
    <>
      <div className={`flex gap-6 transition-all duration-300 ${selectedActivityData ? 'mr-[600px]' : ''}`}>
        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-500" />
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Project Activity
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              All site actions, visits, and updates in one place
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>

        {/* Activity Feed */}
        {groupedActivities.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No activity logged yet. Site actions will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedActivities.map((dateGroup) => {
              const dateCollapsed = collapsedGroups.has(dateGroup.date);
              return (
                <div key={dateGroup.date} className="space-y-3">
                  {/* Date Header */}
                  <button
                    onClick={() => toggleDateGroup(dateGroup.date)}
                    className="flex w-full items-center gap-2 text-left group"
                  >
                    {dateCollapsed ? (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {dateGroup.label}
                    </h3>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  </button>

                  {/* Type Groups */}
                  {!dateCollapsed && (
                    <div className="ml-6 space-y-4">
                      {dateGroup.typeGroups.map((typeGroup) => {
                        const typeCollapsed = collapsedGroups.has(
                          `${dateGroup.date}-${typeGroup.type}`
                        );
                        return (
                          <div key={typeGroup.type} className="space-y-2">
                            {/* Type Header */}
                            <button
                              onClick={() =>
                                toggleTypeGroup(dateGroup.date, typeGroup.type)
                              }
                              className="flex items-center gap-2 text-left group"
                            >
                              {typeCollapsed ? (
                                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                              )}
                              <span className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-slate-400">
                                {typeGroup.label}
                              </span>
                              <Badge variant="muted" className="text-xs">
                                {typeGroup.activities.length}
                              </Badge>
                            </button>

                            {/* Activities */}
                            {!typeCollapsed && (
                              <div className="space-y-2">
                                {typeGroup.activities.map((activity) => (
                                  <ActivityRow
                                    key={activity.id}
                                    activity={activity}
                                    onClick={() => setSelectedActivity(activity.id)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </div>

        {/* Right Summary Panel */}
        <div className={`w-80 space-y-6 flex-shrink-0 ${selectedActivityData ? 'hidden' : ''}`}>
        <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Recent Site Summary
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Last Visit
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {summary.lastVisit?.title || "No visits yet"}
              </div>
              {summary.lastVisit && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {summary.lastVisit.date} • {summary.lastVisit.actor.name}
                </div>
              )}
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Last Call
              </div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {summary.lastCall?.title || "No calls yet"}
              </div>
              {summary.lastCall && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {summary.lastCall.date} • {summary.lastCall.actor.name}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {summary.openIssues}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Open Issues
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {summary.last7Days}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Last 7 Days
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-amber-600 dark:text-amber-400">
                  {summary.momPending}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  MOM Pending
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Activity Detail Panel */}
      {selectedActivityData && (
        <ActivityDetailPanel
          activity={selectedActivityData}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </>
  );
}
