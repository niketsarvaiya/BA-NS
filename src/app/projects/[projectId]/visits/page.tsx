import { Users } from "lucide-react";
import { TabPlaceholder } from "@/modules/projects/components/TabPlaceholder";

export default function VisitsPage() {
  return (
    <TabPlaceholder
      title="Site Visits"
      description="Log and manage site visits, inspections, and field observations."
      icon={Users}
      message="Visit logs, inspection reports, photos, and team attendance tracking will appear here."
    />
  );
}
