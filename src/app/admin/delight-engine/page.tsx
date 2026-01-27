"use client";

import { DelightEngineAdmin } from "@/modules/delight-engine/components/DelightEngineAdmin";
import { useDelightEngine } from "@/modules/delight-engine/context/DelightEngineContext";

export default function DelightEngineAdminPage() {
  const { triggerConfigs, updateTriggerConfig } = useDelightEngine();

  return (
    <DelightEngineAdmin
      triggerConfigs={triggerConfigs}
      onToggleTrigger={updateTriggerConfig}
    />
  );
}
