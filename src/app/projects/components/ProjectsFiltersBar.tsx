"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProjectsFiltersBar() {
  return (
    <div className="rounded-lg border border-zinc-300 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/60 p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Search input */}
        <div className="lg:col-span-2 space-y-1.5">
          <Label
            htmlFor="search"
            className="text-xs text-zinc-400 dark:text-zinc-400 uppercase tracking-wide"
          >
            Search
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400 dark:text-zinc-400" />
            <Input
              id="search"
              placeholder="Client, code, location..."
              className="h-9 pl-8 bg-zinc-900/70 border-zinc-300 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:text-zinc-500"
            />
          </div>
        </div>

        {/* Stage filter */}
        <div className="space-y-1.5">
          <Label
            htmlFor="stage"
            className="text-xs text-zinc-400 dark:text-zinc-400 uppercase tracking-wide"
          >
            Stage
          </Label>
          <select
            id="stage"
            className="h-9 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-zinc-900/70 px-3 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          >
            <option value="">All</option>
            <option value="design">Design</option>
            <option value="audit">Audit</option>
            <option value="execution">Execution</option>
            <option value="qc">QC</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Health filter */}
        <div className="space-y-1.5">
          <Label
            htmlFor="health"
            className="text-xs text-zinc-400 dark:text-zinc-400 uppercase tracking-wide"
          >
            Health
          </Label>
          <select
            id="health"
            className="h-9 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-zinc-900/70 px-3 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          >
            <option value="">All</option>
            <option value="good">Good</option>
            <option value="at-risk">At Risk</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Owner filter */}
        <div className="space-y-1.5">
          <Label
            htmlFor="owner"
            className="text-xs text-zinc-400 dark:text-zinc-400 uppercase tracking-wide"
          >
            Owner
          </Label>
          <select
            id="owner"
            className="h-9 w-full rounded-md border border-zinc-300 dark:border-zinc-800 bg-zinc-900/70 px-3 text-sm text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          >
            <option value="">All</option>
            <option value="user1">Site Supervisor A</option>
            <option value="user2">Site Supervisor B</option>
            <option value="user3">Site Supervisor C</option>
          </select>
        </div>
      </div>

      {/* Toggle for My Projects */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="my-projects"
          className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-primary focus:ring-2 focus:ring-zinc-700 focus:ring-offset-0"
        />
        <Label
          htmlFor="my-projects"
          className="text-sm text-zinc-600 dark:text-zinc-300 font-normal cursor-pointer"
        >
          Show only my projects
        </Label>
      </div>
    </div>
  );
}
