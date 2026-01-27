import { FolderOpen } from "lucide-react";
import { TabPlaceholder } from "@/modules/projects/components/TabPlaceholder";

export default function FilesPage() {
  return (
    <TabPlaceholder
      title="Files & Documents"
      description="Upload, organize, and manage project files and drawings."
      icon={FolderOpen}
      message="File browser, document management, drawings, photos, and version control will appear here."
    />
  );
}
