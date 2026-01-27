"use client";

import * as React from "react";
import type {
  DelightEvent,
  AppreciationSticker,
  TriggerConfig,
  DelightEventType,
  TriggerType,
} from "../types";
import {
  MOCK_DELIGHT_EVENTS,
  MOCK_APPRECIATION_STICKERS,
  MOCK_TRIGGER_CONFIGS,
} from "../utils/mockDelightData";

interface DelightEngineContextValue {
  /** All delight events for the current user */
  delightEvents: DelightEvent[];
  /** Count of unseen events */
  unreadCount: number;
  /** All appreciation stickers received */
  appreciationStickers: AppreciationSticker[];
  /** Count of unseen stickers */
  unreadStickersCount: number;
  /** Trigger a new delight event (placeholder for backend) */
  triggerDelight: (type: DelightEventType, context?: Record<string, unknown>) => void;
  /** Mark event as seen */
  markAsSeen: (eventId: string) => void;
  /** Mark sticker as seen */
  markStickerAsSeen: (stickerId: string) => void;
  /** Trigger configurations for admin */
  triggerConfigs: TriggerConfig[];
  /** Update trigger config (admin only, placeholder) */
  updateTriggerConfig: (triggerId: string, enabled: boolean) => void;
}

const DelightEngineContext = React.createContext<DelightEngineContextValue | null>(null);

interface DelightEngineProviderProps {
  children: React.ReactNode;
}

export function DelightEngineProvider({ children }: DelightEngineProviderProps) {
  const [delightEvents, setDelightEvents] = React.useState<DelightEvent[]>(MOCK_DELIGHT_EVENTS);
  const [appreciationStickers, setAppreciationStickers] = React.useState<AppreciationSticker[]>(
    MOCK_APPRECIATION_STICKERS
  );
  const [triggerConfigs, setTriggerConfigs] = React.useState<TriggerConfig[]>(
    MOCK_TRIGGER_CONFIGS
  );

  const unreadCount = React.useMemo(
    () => delightEvents.filter((e) => !e.seen).length,
    [delightEvents]
  );

  const unreadStickersCount = React.useMemo(
    () => appreciationStickers.filter((s) => !s.seen).length,
    [appreciationStickers]
  );

  const triggerDelight = React.useCallback(
    (type: DelightEventType, context?: Record<string, unknown>) => {
      // TODO: Replace with API call to POST /api/delight/trigger
      console.log("[Delight Engine] Triggering event:", { type, context });

      // For now, just create a mock event
      const newEvent: DelightEvent = {
        id: `de-${Date.now()}`,
        type,
        title: `New ${type} recognition`,
        description: "This is a placeholder event triggered programmatically.",
        timestamp: new Date().toISOString(),
        seen: false,
        metadata: context,
      };

      setDelightEvents((prev) => [newEvent, ...prev]);
    },
    []
  );

  const markAsSeen = React.useCallback((eventId: string) => {
    // TODO: Replace with API call to PATCH /api/delight/events/:id/seen
    setDelightEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, seen: true } : event))
    );
  }, []);

  const markStickerAsSeen = React.useCallback((stickerId: string) => {
    // TODO: Replace with API call to PATCH /api/delight/stickers/:id/seen
    setAppreciationStickers((prev) =>
      prev.map((sticker) => (sticker.id === stickerId ? { ...sticker, seen: true } : sticker))
    );
  }, []);

  const updateTriggerConfig = React.useCallback((triggerId: string, enabled: boolean) => {
    // TODO: Admin controls call PATCH /api/delight/settings/triggers/:id
    console.log("[Delight Engine Admin] Updating trigger:", { triggerId, enabled });

    setTriggerConfigs((prev) =>
      prev.map((config) => (config.id === triggerId ? { ...config, enabled } : config))
    );
  }, []);

  const value: DelightEngineContextValue = {
    delightEvents,
    unreadCount,
    appreciationStickers,
    unreadStickersCount,
    triggerDelight,
    markAsSeen,
    markStickerAsSeen,
    triggerConfigs,
    updateTriggerConfig,
  };

  return (
    <DelightEngineContext.Provider value={value}>{children}</DelightEngineContext.Provider>
  );
}

export function useDelightEngine() {
  const context = React.useContext(DelightEngineContext);
  if (!context) {
    throw new Error("useDelightEngine must be used within DelightEngineProvider");
  }
  return context;
}
