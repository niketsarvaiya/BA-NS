import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface TabPlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  message?: string;
}

export function TabPlaceholder({
  title,
  description,
  icon: Icon,
  message = "This feature will be available once the project structure is finalized.",
}: TabPlaceholderProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="text-sm text-zinc-400 dark:text-zinc-400">{description}</p>
      </div>

      <Card className="border-zinc-300 dark:border-zinc-800/70 bg-zinc-900/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            <Icon className="h-4 w-4 text-zinc-400 dark:text-zinc-400" />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400 dark:text-zinc-400">{message}</p>
        </CardContent>
      </Card>

      <Card className="border-zinc-300 dark:border-zinc-800/70 bg-zinc-900/40">
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Planned Features
              </h3>
              <ul className="space-y-1 text-sm text-zinc-400 dark:text-zinc-400">
                <li>• Data visualization</li>
                <li>• Real-time updates</li>
                <li>• Export capabilities</li>
              </ul>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Integrations
              </h3>
              <ul className="space-y-1 text-sm text-zinc-400 dark:text-zinc-400">
                <li>• Task management</li>
                <li>• Document storage</li>
                <li>• Team collaboration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
