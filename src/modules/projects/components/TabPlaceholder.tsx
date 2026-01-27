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
  const isFilesTab = title === "Files & Documents";

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {isFilesTab ? "Direct Google Drive integration" : "Coming Soon"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground max-w-2xl">{message}</p>
        </CardContent>
      </Card>

      {!isFilesTab && (
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Planned Features
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Data visualization</li>
                  <li>• Real-time updates</li>
                  <li>• Export capabilities</li>
                </ul>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Integrations
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Task management</li>
                  <li>• Document storage</li>
                  <li>• Team collaboration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
