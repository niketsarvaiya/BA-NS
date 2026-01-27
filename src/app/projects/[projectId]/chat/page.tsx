import { MessageCircle } from "lucide-react";
import { TabPlaceholder } from "@/modules/projects/components/TabPlaceholder";

export default function ChatPage() {
  return (
    <TabPlaceholder
      title="Team Chat"
      description="Real-time messaging and collaboration for project team members."
      icon={MessageCircle}
      message="Project-specific chat channels, direct messages, and conversation threads will appear here."
    />
  );
}
