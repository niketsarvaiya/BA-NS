"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Shield, ToggleLeft, ToggleRight, Info } from "lucide-react";
import type { TriggerConfig } from "../types";

interface DelightEngineAdminProps {
  triggerConfigs: TriggerConfig[];
  onToggleTrigger: (triggerId: string, enabled: boolean) => void;
  /** Stats for display (placeholder) */
  stats?: {
    totalRecognitionsSent: number;
    totalTriggersActive: number;
    recentActivityCount: number;
  };
}

export function DelightEngineAdmin({
  triggerConfigs,
  onToggleTrigger,
  stats = {
    totalRecognitionsSent: 127,
    totalTriggersActive: triggerConfigs.filter((t) => t.enabled).length,
    recentActivityCount: 34,
  },
}: DelightEngineAdminProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Delight Engine Administration
          </h1>
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Configure recognition triggers and view aggregate signals. Changes here affect the
          entire system.
        </p>
      </section>

      {/* Stats cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm p-4">
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Recognitions</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {stats.totalRecognitionsSent}
            </p>
          </div>
        </Card>
        <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm p-4">
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Active Triggers</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {stats.totalTriggersActive} / {triggerConfigs.length}
            </p>
          </div>
        </Card>
        <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm p-4">
          <div className="space-y-1">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Recent Activity (7d)</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {stats.recentActivityCount}
            </p>
          </div>
        </Card>
      </section>

      {/* Trigger configurations */}
      <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm">
        <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Trigger Configuration
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Enable or disable recognition triggers. Disabled triggers will not fire new events.
          </p>
        </div>

        <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
          {triggerConfigs.map((trigger) => (
            <TriggerConfigRow
              key={trigger.id}
              trigger={trigger}
              onToggle={onToggleTrigger}
            />
          ))}
        </div>
      </Card>

      {/* Backend integration note */}
      <div className="flex items-start gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-900/40 dark:bg-sky-900/20">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-700 dark:text-sky-400" />
        <div className="space-y-1">
          <p className="text-xs font-medium text-sky-900 dark:text-sky-100">
            Frontend-only placeholder
          </p>
          <p className="text-xs leading-relaxed text-sky-700 dark:text-sky-300">
            All trigger toggles and stats are currently driven by frontend state. Backend
            integration required to persist settings and view real aggregate data.
          </p>
        </div>
      </div>
    </div>
  );
}

interface TriggerConfigRowProps {
  trigger: TriggerConfig;
  onToggle: (triggerId: string, enabled: boolean) => void;
}

function TriggerConfigRow({ trigger, onToggle }: TriggerConfigRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {trigger.description}
          </p>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
              trigger.enabled
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900/30 dark:text-zinc-400"
            )}
          >
            {trigger.enabled ? "Active" : "Disabled"}
          </span>
        </div>
        {trigger.criteria && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Criteria: {trigger.criteria}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onToggle(trigger.id, !trigger.enabled)}
        className="group flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        {trigger.enabled ? (
          <>
            <ToggleRight className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            <span className="text-zinc-700 dark:text-zinc-300">Enabled</span>
          </>
        ) : (
          <>
            <ToggleLeft className="h-4 w-4 text-zinc-400" />
            <span className="text-zinc-500 dark:text-zinc-400">Disabled</span>
          </>
        )}
      </button>
    </div>
  );
}
