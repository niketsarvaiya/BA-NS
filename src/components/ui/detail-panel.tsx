import { X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface DetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
  className?: string;
}

const widthClasses = {
  sm: "w-[400px]",
  md: "w-[600px]",
  lg: "w-[800px]",
};

export function DetailPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  width = "md",
  className,
}: DetailPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-16 bottom-0 right-0 border-l border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 overflow-y-auto z-40",
          widthClasses[width],
          className
        )}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div className="min-w-0 flex-1">
              {subtitle && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {subtitle}
                </div>
              )}
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
                {title}
              </h2>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}

// Section component for consistent spacing
interface DetailPanelSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DetailPanelSection({
  title,
  icon,
  children,
  className,
}: DetailPanelSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}
