import { useState } from "react";
import type { ProjectActivity } from "../types";
import { Calendar, User, FileText, AlertCircle, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";
import {
  ACTIVITY_TYPE_ICONS,
  ACTIVITY_TYPE_COLORS,
  ACTIVITY_TYPE_LABELS,
} from "../utils/activityHelpers";
import { formatDuration } from "../utils/groupActivitiesByDate";

interface ActivityDetailPanelProps {
  activity: ProjectActivity;
  onClose: () => void;
}

export function ActivityDetailPanel({ activity, onClose }: ActivityDetailPanelProps) {
  const [mom, setMom] = useState(activity.mom || "");
  const [isEditingMom, setIsEditingMom] = useState(false);

  const Icon = ACTIVITY_TYPE_ICONS[activity.type];
  const colors = ACTIVITY_TYPE_COLORS[activity.type];

  const handleSaveMom = () => {
    // BACKEND NOTE: Save MOM to backend API
    console.log("Saving MOM:", mom);
    setIsEditingMom(false);
  };

  const iconElement = (
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg}`}>
      <Icon className={`h-5 w-5 ${colors.icon}`} />
    </div>
  );

  const subtitle = `${ACTIVITY_TYPE_LABELS[activity.type]}${activity.subType ? ` • ${activity.subType}` : ""}`;

  return (
    <DetailPanel
      isOpen={true}
      onClose={onClose}
      title={activity.title}
      subtitle={subtitle}
      icon={iconElement}
      width="md"
    >
      <div className="space-y-6">
        {/* Actor & Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <DetailPanelSection title="Actor" icon={<User className="h-3.5 w-3.5" />}>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {activity.actor.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {activity.actor.role}
            </div>
          </DetailPanelSection>

          <DetailPanelSection title="Date & Time" icon={<Calendar className="h-3.5 w-3.5" />}>
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {new Date(activity.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {activity.time && ` at ${activity.time}`}
            </div>
            {activity.durationMinutes && (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Duration: {formatDuration(activity.durationMinutes)}
              </div>
            )}
          </DetailPanelSection>
        </div>

        {/* Description */}
        {activity.description && (
          <DetailPanelSection title="Description" icon={<FileText className="h-3.5 w-3.5" />}>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {activity.description}
            </p>
          </DetailPanelSection>
        )}

        {/* MOM Section */}
        {activity.momRequired && (
          <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
                <FileText className="h-4 w-4" />
                Minutes of Meeting (MOM)
                {!activity.mom && (
                  <Badge variant="warning" className="text-xs">
                    Pending
                  </Badge>
                )}
              </div>
              {activity.mom && !isEditingMom && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingMom(true)}
                >
                  Edit
                </Button>
              )}
            </div>

            {isEditingMom ? (
              <div className="space-y-3">
                <Textarea
                  value={mom}
                  onChange={(e) => setMom(e.target.value)}
                  placeholder="Enter minutes of meeting..."
                  className="min-h-[200px] font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveMom}>
                    Save MOM
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMom(activity.mom || "");
                      setIsEditingMom(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : activity.mom ? (
              <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {activity.mom}
                </pre>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This activity requires minutes of meeting documentation.
                </p>
                <Button size="sm" onClick={() => setIsEditingMom(true)}>
                  Add MOM
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Issues Reported */}
        {activity.issuesReported && activity.issuesReported.length > 0 && (
          <DetailPanelSection
            title={`Issues Reported (${activity.issuesReported.length})`}
            icon={<AlertCircle className="h-3.5 w-3.5" />}
          >
            <div className="space-y-2">
              {activity.issuesReported.map((issue, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20"
                >
                  <div className="flex items-start gap-2">
                    <Badge
                      variant={
                        issue.severity === "HIGH"
                          ? "destructive"
                          : issue.severity === "MEDIUM"
                          ? "warning"
                          : "muted"
                      }
                      className="text-xs"
                    >
                      {issue.severity}
                    </Badge>
                    <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                      {issue.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DetailPanelSection>
        )}

        {/* Attachments */}
        {activity.attachments && activity.attachments.length > 0 && (
          <DetailPanelSection
            title={`Attachments (${activity.attachments.length})`}
            icon={<Paperclip className="h-3.5 w-3.5" />}
          >
            <div className="space-y-2">
              {activity.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50"
                >
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
                    {attachment.name}
                  </span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </DetailPanelSection>
        )}

        {/* Related Context */}
        {(activity.relatedTaskId || activity.relatedRoomId || activity.relatedBOQItemId) && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Related Context
            </div>
            <div className="flex flex-wrap gap-2">
              {activity.relatedTaskId && (
                <Badge variant="muted" className="text-xs">
                  Task: {activity.relatedTaskId}
                </Badge>
              )}
              {activity.relatedRoomId && (
                <Badge variant="muted" className="text-xs">
                  Room: {activity.relatedRoomId}
                </Badge>
              )}
              {activity.relatedBOQItemId && (
                <Badge variant="muted" className="text-xs">
                  BOQ: {activity.relatedBOQItemId}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </DetailPanel>
  );
}
