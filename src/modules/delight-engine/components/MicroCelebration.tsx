"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CelebrationType } from "../types";

interface MicroCelebrationProps {
  variant: CelebrationType;
  message?: string;
  position?: { x: number; y: number };
  onComplete?: () => void;
  children?: React.ReactNode;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

const CONFETTI_COLORS = [
  "bg-emerald-400",
  "bg-sky-400",
  "bg-amber-400",
  "bg-indigo-400",
  "bg-zinc-300",
];

export function MicroCelebration({
  variant,
  message,
  position,
  onComplete,
  children,
}: MicroCelebrationProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    if (variant === "confetti") {
      // Generate minimal particles (8-10 for subtlety)
      const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);
    }

    // Auto-dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [variant, onComplete]);

  if (!isVisible) {
    return null;
  }

  const positionStyle = position
    ? {
        left: position.x,
        top: position.y,
      }
    : {};

  if (variant === "glow") {
    return (
      <div
        className="relative"
        style={positionStyle}
      >
        {children ? (
          <div className="animate-subtle-glow">{children}</div>
        ) : (
          <div className="pointer-events-none absolute inset-0 z-10 animate-subtle-pulse rounded-lg border-2 border-emerald-400/60 bg-emerald-50/20 dark:border-emerald-500/40 dark:bg-emerald-900/20" />
        )}
        {message && (
          <div className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 animate-fade-in-up whitespace-nowrap rounded-md bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-50 shadow-lg dark:bg-zinc-100/90 dark:text-zinc-900">
            {message}
          </div>
        )}
      </div>
    );
  }

  // Confetti variant
  return (
    <div
      className="pointer-events-none absolute z-50"
      style={positionStyle}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            "absolute h-2 w-2 animate-confetti-fall rounded-sm opacity-0",
            particle.color
          )}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      {message && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 animate-fade-in-up whitespace-nowrap rounded-md bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-50 shadow-lg dark:bg-zinc-100/90 dark:text-zinc-900">
          {message}
        </div>
      )}
    </div>
  );
}

// Add custom animations to global CSS or component styles
// These should be added to the global CSS file (globals.css)
/*
@keyframes subtle-glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 16px rgba(16, 185, 129, 0.5);
  }
}

@keyframes subtle-pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(100px) rotate(360deg);
  }
}

.animate-subtle-glow {
  animation: subtle-glow 2s ease-in-out;
}

.animate-subtle-pulse {
  animation: subtle-pulse 2s ease-in-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}

.animate-confetti-fall {
  animation: confetti-fall 2s ease-out forwards;
}
*/
