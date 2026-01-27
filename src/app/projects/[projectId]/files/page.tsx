import { FolderOpen } from "lucide-react";
import { TabPlaceholder } from "@/modules/projects/components/TabPlaceholder";

export default function FilesPage() {
  return (
    <TabPlaceholder
      title="Files & Documents"
      description="Direct integration with Google Drive for all project files and drawings."
      icon={FolderOpen}
      message="This space will show a tightly integrated Google Drive experience – structured folders for each project, quick access to drawings, photos, and documents, and permission-aware file actions right inside Beyond Assist."
    />
  );
}
