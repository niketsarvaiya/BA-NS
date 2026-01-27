/**
 * Delight Engine Domain Models
 * Frontend-only types for recognition and celebration system
 */

export type DelightEventType = 
  | "milestone" 
  | "quality" 
  | "consistency" 
  | "learning" 
  | "peer_thanks";

export type TriggerType = 
  | "task_completion" 
  | "streak" 
  | "first_time" 
  | "peer_sticker" 
  | "quality_score"
  | "project_milestone";

export type StickerVariant = 
  | "thanks" 
  | "great_work" 
  | "helpful"
  | "collaboration";

export type CelebrationType = "confetti" | "glow";

export interface DelightEvent {
  id: string;
  type: DelightEventType;
  title: string;
  description: string;
  timestamp: string;
  seen: boolean;
  metadata?: Record<string, unknown>;
  /** Optional icon name from lucide-react */
  iconName?: string;
}

export interface AppreciationSticker {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  message: string;
  variant: StickerVariant;
  timestamp: string;
  /** Optional context like task ID or project ID */
  context?: string;
  seen: boolean;
}

export interface TriggerConfig {
  id: string;
  type: TriggerType;
  enabled: boolean;
  description: string;
  /** Threshold or criteria description */
  criteria?: string;
}

export interface DelightEngineStats {
  totalRecognitions: number;
  recognitionsByType: Record<DelightEventType, number>;
  recentStickersReceived: number;
  recentStickersSent: number;
}

export interface MicroCelebrationProps {
  variant: CelebrationType;
  message?: string;
  position?: { x: number; y: number };
  onComplete?: () => void;
}

export interface DelightToastData {
  id: string;
  title: string;
  description?: string;
  iconName?: string;
  duration?: number;
  type: DelightEventType;
}
