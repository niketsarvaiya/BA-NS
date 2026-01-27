"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProjectsFiltersBar() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Search input */}
        <div className="lg:col-span-2 space-y-1.5">
          <Label
            htmlFor="search"
            className="text-meta text-muted-foreground uppercase tracking-wide"
          >
            Search
          </Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Client, code, location..."
              className="h-9 pl-8 text-sm"
            />
          </div>
        </div>

        {/* Stage filter */}
        <div className="space-y-1.5">
          <Label
            htmlFor="stage"
            className="text-meta text-muted-foreground uppercase tracking-wide"
          >
            Stage
          </Label>
          <select
            id="stage"
            className="h-9 w-full rounded-[10px] border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
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
            className="text-meta text-muted-foreground uppercase tracking-wide"
          >
            Health
          </Label>
          <select
            id="health"
            className="h-9 w-full rounded-[10px] border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
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
            className="text-meta text-muted-foreground uppercase tracking-wide"
          >
            Owner
          </Label>
          <select
            id="owner"
            className="h-9 w-full rounded-[10px] border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
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
          className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-smooth"
        />
        <Label
          htmlFor="my-projects"
          className="text-sm text-foreground font-normal cursor-pointer"
        >
          Show only my projects
        </Label>
      </div>
    </div>
  );
}
