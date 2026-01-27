"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useDelightEngine } from "@/modules/delight-engine/context/DelightEngineContext";
import { MicroCelebration } from "@/modules/delight-engine/components/MicroCelebration";
import { DelightToastContainer } from "@/modules/delight-engine/components/DelightToast";
import { DelightFeed } from "@/modules/delight-engine/components/DelightFeed";
import { AppreciationStickerList } from "@/modules/delight-engine/components/AppreciationSticker";
import { StickerComposer } from "@/modules/delight-engine/components/StickerComposer";
import type { DelightToastData, DelightEventType, CelebrationType } from "@/modules/delight-engine/types";

export default function DelightEngineDemoPage() {
  const {
    delightEvents,
    appreciationStickers,
    markAsSeen,
    triggerDelight,
  } = useDelightEngine();

  const [toasts, setToasts] = React.useState<DelightToastData[]>([]);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [celebrationType, setCelebrationType] = React.useState<CelebrationType>("confetti");
  const [celebrationMessage, setCelebrationMessage] = React.useState("");
  const [showStickerComposer, setShowStickerComposer] = React.useState(false);

  const addToast = (type: DelightEventType, title: string, description?: string) => {
    const newToast: DelightToastData = {
      id: `toast-${Date.now()}`,
      type,
      title,
      description,
      duration: 5000,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerCelebration = (variant: CelebrationType, message: string) => {
    setCelebrationType(variant);
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  const handleStickerSubmit = (data: { recipientId: string; variant: string; message: string }) => {
    addToast("peer_thanks", "Appreciation sent!", `Your message was sent to ${data.recipientId}`);
    setShowStickerComposer(false);
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      {/* Header */}
      <section>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Delight Engine Demo
          </h1>
        </div>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Interactive showcase of all Delight Engine components. Click buttons to test effects.
        </p>
      </section>

      {/* Toast Notifications Section */}
      <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Toast Notifications
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Click any button to trigger a toast notification with different event types and colors
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() =>
                addToast(
                  "milestone",
                  "Milestone reached",
                  "You completed your 100th task. The system noticed your consistent delivery."
                )
              }
              variant="outline"
            >
              Milestone Toast
            </Button>
            <Button
              onClick={() =>
                addToast(
                  "quality",
                  "Quality review passed",
                  "Task passed quality review on first attempt. Client noted attention to detail."
                )
              }
              variant="outline"
            >
              Quality Toast
            </Button>
            <Button
              onClick={() =>
                addToast(
                  "consistency",
                  "Seven-day streak",
                  "You've completed tasks on schedule for seven consecutive days."
                )
              }
              variant="outline"
            >
              Consistency Toast
            </Button>
            <Button
              onClick={() =>
                addToast(
                  "learning",
                  "Certification earned",
                  "Completed Data Privacy Compliance certification. Required for client work."
                )
              }
              variant="outline"
            >
              Learning Toast
            </Button>
            <Button
              onClick={() =>
                addToast(
                  "peer_thanks",
                  "Recognition from colleague",
                  "Priya sent you an appreciation for collaboration on Project Omega."
                )
              }
              variant="outline"
            >
              Peer Thanks Toast
            </Button>
          </div>
        </div>
      </Card>

      {/* Micro Celebrations Section */}
      <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Micro Celebrations
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Subtle visual effects that appear near actions. Watch the target area below.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => triggerCelebration("confetti", "Nice work!")}
              variant="outline"
            >
              Trigger Confetti
            </Button>
            <Button
              onClick={() => triggerCelebration("glow", "Task completed")}
              variant="outline"
            >
              Trigger Glow
            </Button>
          </div>
          <div className="relative mt-4 flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900/50">
            {showCelebration && (
              <MicroCelebration
                variant={celebrationType}
                message={celebrationMessage}
                onComplete={() => setShowCelebration(false)}
              />
            )}
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {showCelebration ? "🎉 Celebration in progress..." : "Click a button to see celebration here"}
            </p>
          </div>
        </div>
      </Card>

      {/* Delight Events Section */}
      <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Trigger New Events
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Programmatically trigger delight events that will appear in the feed below
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => {
                triggerDelight("milestone", { source: "demo", taskId: "demo-task" });
                addToast("milestone", "Event triggered", "A new milestone event was added to your feed");
              }}
              variant="outline"
            >
              Trigger Milestone Event
            </Button>
            <Button
              onClick={() => {
                triggerDelight("quality", { source: "demo", score: 95 });
                addToast("quality", "Event triggered", "A new quality event was added to your feed");
              }}
              variant="outline"
            >
              Trigger Quality Event
            </Button>
            <Button
              onClick={() => {
                triggerDelight("consistency", { source: "demo", streak: 7 });
                addToast("consistency", "Event triggered", "A new consistency event was added to your feed");
              }}
              variant="outline"
            >
              Trigger Consistency Event
            </Button>
          </div>
        </div>
      </Card>

      {/* Layout with Feed and Stickers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Delight Feed */}
        <div>
          <DelightFeed
            events={delightEvents}
            showFilters={true}
            onEventClick={(event) => {
              if (!event.seen) {
                markAsSeen(event.id);
                addToast("milestone", "Event marked as seen", "");
              }
            }}
          />
        </div>

        {/* Appreciation Stickers */}
        <div className="space-y-4">
          <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Appreciation Stickers
                </h2>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Received peer recognitions. Click to expand.
                </p>
              </div>
              {appreciationStickers.length > 0 ? (
                <AppreciationStickerList stickers={appreciationStickers} maxVisible={5} />
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No appreciation stickers received yet.
                </p>
              )}
            </div>
          </Card>

          {/* Sticker Composer */}
          <Card className="border-zinc-300 bg-zinc-50 dark:border-zinc-800/70 dark:bg-zinc-950/60 shadow-sm p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Send Appreciation
                </h2>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Test the sticker composer UI
                </p>
              </div>
              {!showStickerComposer ? (
                <Button onClick={() => setShowStickerComposer(true)}>
                  Open Sticker Composer
                </Button>
              ) : (
                <StickerComposer
                  recipientName="Demo User"
                  context="demo-context"
                  onSubmit={handleStickerSubmit}
                  onCancel={() => setShowStickerComposer(false)}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Toast Container */}
      <DelightToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
