"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import type { DelightEvent, DelightEventType } from "../types";
import {
  getEventIcon,
  getEventAccentColor,
  getEventTypeLabel,
  formatRelativeTime,
} from "../utils/eventHelpers";

interface DelightFeedProps {
  events: DelightEvent[];
  showFilters?: boolean;
  onEventClick?: (event: DelightEvent) => void;
}

const EVENT_TYPE_FILTERS: { value: DelightEventType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "milestone", label: "Milestones" },
  { value: "quality", label: "Quality" },
  { value: "consistency", label: "Consistency" },
  { value: "learning", label: "Learning" },
  { value: "peer_thanks", label: "Recognition" },
];

export function DelightFeed({
  events,
  showFilters = true,
  onEventClick,
}: DelightFeedProps) {
  const [selectedFilter, setSelectedFilter] = React.useState<DelightEventType | "all">("all");

  const filteredEvents =
    selectedFilter === "all"
      ? events
      : events.filter((event) => event.type === selectedFilter);

  const groupedByDate = React.useMemo(() => {
    const groups: Record<string, DelightEvent[]> = {};

    filteredEvents.forEach((event) => {
      const date = new Date(event.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday";
      } else {
        groupKey = date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(event);
    });

    return groups;
  }, [filteredEvents]);

  return (
    <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm">
      <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Recognition Feed
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
              Private log of your achievements and recognitions. The system quietly keeps track.
            </p>
          </div>
          {showFilters && (
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Filter className="h-3 w-3" />
              <span>Filter</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {EVENT_TYPE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setSelectedFilter(filter.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  selectedFilter === filter.value
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-h-[600px] overflow-y-auto p-4">
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No recognitions yet. Keep working, the system will notice.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByDate).map(([dateLabel, dayEvents]) => (
              <section key={dateLabel} className="space-y-3">
                <h3 className="text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {dateLabel}
                </h3>
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <DelightFeedItem
                      key={event.id}
                      event={event}
                      onClick={onEventClick}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

interface DelightFeedItemProps {
  event: DelightEvent;
  onClick?: (event: DelightEvent) => void;
}

function DelightFeedItem({ event, onClick }: DelightFeedItemProps) {
  const accentColor = getEventAccentColor(event.type);
  const Icon = React.useMemo(() => getEventIcon(event.iconName || event.type), [event.iconName, event.type]);

  return (
    <button
      type="button"
      onClick={() => onClick?.(event)}
      className={cn(
        "group relative flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
        "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:border-zinc-700",
        !event.seen && "ring-1 ring-zinc-900/5 dark:ring-zinc-50/5"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md",
          accentColor.bg
        )}
      >
        <Icon className={cn("h-4 w-4", accentColor.icon)} />
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium leading-tight text-zinc-900 dark:text-zinc-50">
            {event.title}
          </p>
          {!event.seen && (
            <span className="h-2 w-2 flex-shrink-0 rounded-full bg-sky-500" />
          )}
        </div>
        <p className="text-xs leading-snug text-zinc-600 dark:text-zinc-400">
          {event.description}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-500">
          <span>{getEventTypeLabel(event.type)}</span>
          <span>•</span>
          <span>{formatRelativeTime(event.timestamp)}</span>
        </div>
      </div>
    </button>
  );
}
