# Delight Engine

A frontend-only recognition and celebration system for Beyond Assist. Provides subtle, respectful acknowledgment of work milestones, quality signals, consistency, and learning growth without gamification or public rankings.

## Philosophy

- **Calm & Professional**: No bright colors, no flashy animations, no competitive elements
- **Private Recognition**: All recognitions are personal and not publicly ranked
- **Backend-Ready**: All components include placeholder API integration points
- **Respectful Tone**: Professional copy without slang or emojis

## Components

### Core UI Components

#### `MicroCelebration`
Subtle visual celebrations that appear near relevant actions:
- **Confetti variant**: Minimal particles with soft colors
- **Glow variant**: Subtle pulsing border/background effect
- Auto-dismisses after 2-3 seconds

```tsx
<MicroCelebration 
  variant="confetti" 
  message="Nice work!" 
  position={{ x: 100, y: 200 }}
  onComplete={() => console.log('Animation complete')}
/>
```

#### `DelightToast`
Calm toast notifications with auto-dismiss:
- Appears from top-right corner
- Contains icon, title, and optional description
- Neutral color palette with subtle accent colors
- Auto-dismisses after 5 seconds (configurable)

```tsx
import { DelightToastContainer } from '@/modules/delight-engine/components';

<DelightToastContainer 
  toasts={toasts} 
  onDismiss={handleDismiss} 
/>
```

#### `DelightFeed`
Private chronological log of recognitions:
- Timeline layout with date grouping
- Filter by type (milestone, quality, consistency, learning, peer_thanks)
- Each entry shows icon, title, description, and timestamp
- Subtle hover effects

```tsx
<DelightFeed 
  events={delightEvents}
  showFilters={true}
  onEventClick={(event) => markAsSeen(event.id)}
/>
```

#### `AppreciationSticker` & `AppreciationStickerList`
Peer-to-peer thanks system:
- Small badge-like UI element
- Shows giver name, message, and timestamp
- Click to expand for full message
- Calm visual style matching badge system

```tsx
<AppreciationStickerList 
  stickers={stickers}
  maxVisible={5}
/>
```

#### `StickerComposer`
UI for sending appreciation stickers:
- Select recipient and sticker type
- Add custom message (200 char max)
- Preview before sending
- Submit placeholder (backend integration pending)

```tsx
<StickerComposer
  recipientId="user-123"
  recipientName="John Doe"
  context="task-456"
  onSubmit={handleStickerSubmit}
  onCancel={handleCancel}
/>
```

#### `DelightEngineAdmin`
Admin control panel (role-gated):
- Toggle triggers on/off
- View aggregate recognition counts
- Configure delay/frequency thresholds
- All backend logic stubbed with comments

## Context & State Management

### `DelightEngineContext`

Provides global state for the delight engine:

```tsx
const {
  delightEvents,        // Array of user's delight events
  unreadCount,          // Number of unseen events
  appreciationStickers, // Array of received stickers
  unreadStickersCount,  // Number of unseen stickers
  triggerDelight,       // Function to fire a delight event
  markAsSeen,           // Mark event as viewed
  markStickerAsSeen,    // Mark sticker as viewed
  triggerConfigs,       // Admin trigger configurations
  updateTriggerConfig,  // Update trigger settings (admin only)
} = useDelightEngine();
```

## Types

### Event Types
- `milestone`: Project milestones, task completions
- `quality`: High quality work, first-pass approvals
- `consistency`: Streaks, deadline adherence
- `learning`: Training completions, certifications
- `peer_thanks`: Appreciation from colleagues

### Sticker Variants
- `thanks`: General gratitude
- `great_work`: Exceptional work quality
- `helpful`: Assistance provided
- `collaboration`: Team collaboration

## Integration Points

### Current Integrations
1. **Profile Page**: DelightFeed displays in profile below badges
2. **Root Layout**: DelightEngineProvider wraps entire app
3. **Admin Panel**: `/admin/delight-engine` route for configuration

### Future Integrations (Placeholder)
- Task completion flows: Trigger micro-celebration on completion
- Global chat: Show appreciation stickers in message UI
- AppShell header: Delight notification icon with unread count (optional)

## Mock Data

All components use mock data from `utils/mockDelightData.ts`:
- 10 sample delight events spanning last 30 days
- 4 sample appreciation stickers
- 6 trigger configurations

## Backend Integration Points

All backend integration points are marked with `// TODO:` comments:

```typescript
// TODO: Replace with API call to POST /api/delight/trigger
// TODO: Fetch user's delight feed from GET /api/delight/feed
// TODO: Submit sticker via POST /api/delight/sticker
// TODO: Admin controls call PATCH /api/delight/settings
```

## Visual Design

- **Neutral palette**: zinc/slate tones
- **Soft accent colors**: 
  - Emerald (quality)
  - Sky (milestone)
  - Amber (consistency)
  - Indigo (learning)
- **Minimal animations**: 200-300ms transitions
- **Professional icons**: lucide-react icons
- **Dark mode**: Full support with subtle color variations

## Routes

- `/profile` - User profile with DelightFeed
- `/admin/delight-engine` - Admin configuration panel (admin role required)

## Files Structure

```
src/modules/delight-engine/
├── components/
│   ├── AppreciationSticker.tsx
│   ├── DelightEngineAdmin.tsx
│   ├── DelightFeed.tsx
│   ├── DelightToast.tsx
│   ├── MicroCelebration.tsx
│   ├── StickerComposer.tsx
│   └── index.ts
├── context/
│   └── DelightEngineContext.tsx
├── utils/
│   ├── eventHelpers.ts
│   └── mockDelightData.ts
├── types.ts
└── README.md
```

## Usage Example

```tsx
"use client";

import { useDelightEngine } from "@/modules/delight-engine/context/DelightEngineContext";
import { DelightFeed } from "@/modules/delight-engine/components";

export function MyComponent() {
  const { delightEvents, markAsSeen, triggerDelight } = useDelightEngine();

  const handleTaskComplete = () => {
    // Trigger a delight event
    triggerDelight("milestone", { taskId: "task-123" });
  };

  return (
    <div>
      <button onClick={handleTaskComplete}>Complete Task</button>
      <DelightFeed 
        events={delightEvents}
        onEventClick={(event) => markAsSeen(event.id)}
      />
    </div>
  );
}
```

## Notes

- All components are client-side only ("use client" directive)
- No external dependencies beyond existing project stack
- Animations use CSS keyframes for lightweight performance
- All timestamps use ISO 8601 format
- Localization uses "en-IN" for date formatting
