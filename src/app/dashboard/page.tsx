import {
  FolderKanban,
  ListChecks,
  AlertTriangle,
  ArrowRightCircle,
  Plus,
  Users,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = [
    { label: "Active Projects", value: 12, sub: "3 at risk", icon: FolderKanban },
    { label: "Tasks Due Today", value: 28, sub: "15 assigned to you", icon: ListChecks },
    { label: "Open Issues", value: 6, sub: "2 critical", icon: AlertTriangle },
  ];

  const activity = [
    { title: "Site visit completed", meta: "Project Skyline - 12 min ago" },
    { title: "QC checklist updated", meta: "Greenfield Tower - 35 min ago" },
    { title: "New task assigned", meta: "Northbridge Hub - 1 hr ago" },
    { title: "Drawing revision uploaded", meta: "Harbor Point - 2 hrs ago" },
  ];

  const quickActions = [
    { label: "Create Project", icon: Plus },
    { label: "Log Site Visit", icon: Users },
    { label: "New Task List", icon: ListChecks },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-400 max-w-2xl">
          High-level view of your field operations. These numbers are mocked for now.
        </p>
      </div>

      {/* Row 1: Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="border-zinc-300 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/60 shadow-sm hover:shadow-md transition-shadow duration-150"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    {item.label}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs text-zinc-400 dark:text-zinc-400">
                    {item.sub}
                  </CardDescription>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{item.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Row 2: Activity + Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 border-zinc-300 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 dark:text-zinc-400">
              Latest movements across your active projects.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3">
              {activity.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start justify-between gap-3 rounded-lg border border-transparent px-2 py-1.5 hover:border-zinc-300 dark:border-zinc-800 hover:bg-zinc-900/70 transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-sm text-zinc-800 dark:text-zinc-100 truncate">{item.title}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{item.meta}</p>
                  </div>
                  <ArrowRightCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-600" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-zinc-300 dark:border-zinc-800/70 bg-zinc-50 dark:bg-zinc-950/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 dark:text-zinc-400">
              Shortcuts to the things you do most often.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="space-y-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    size="sm"
                    className="w-full justify-between rounded-lg border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-900/80 hover:border-zinc-300 dark:border-zinc-700 hover:-translate-y-px transition-colors transition-transform duration-150"
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span>{action.label}</span>
                    </span>
                    <ArrowRightCircle className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
