# Beyond Assist Design System
## Design Tokens & Guidelines

> **Philosophy**: This is an internal operations assistant. The UI must feel like a silent, competent partner — calm, reliable, and psychologically inviting for daily use.

---

## Color System

### Day Mode
```css
App Background:    #F7F8FA
Card Surface:      #FFFFFF
Primary Text:      #1C1E21
Secondary Text:    #6B7280
Borders/Dividers:  #E5E7EB
```

### Dark Mode
```css
App Background:    #0E1116
Card Surface:      #161A22
Primary Text:      #E5E7EB
Secondary Text:    #9CA3AF
Borders/Dividers:  #2A2F3A
```

### Accent Colors
**Use sparingly — maximum 3 visible accent colors at once**

#### Primary Action / Focus (Blue)
- Day: `#2563EB`
- Dark: `#3B82F6`
- Usage: Primary buttons, links, focused states

#### Success / Completion (Green)
- Day: `#16A34A`
- Dark: `#22C55E`
- Usage: Task completion, success messages, positive indicators

#### Attention / Risk (Amber)
- Day: `#D97706`
- Dark: `#F59E0B`
- Usage: Warnings, pending states (avoid red unless destructive)

#### Destructive (Red - rare use)
- Day: `#DC2626`
- Dark: `#EF4444`
- Usage: Only for irreversible destructive actions

---

## Typography

### Primary Font
**Inter** - Used for all text throughout the application

### Type Scale

```css
Page Titles:       24-28px (1.5-1.75rem), Semibold
Section Headers:   16-18px (1-1.125rem), Semibold
Body Text:         14-15px (0.875-0.9375rem), Regular
Meta/Helper Text:  12-13px (0.75-0.8125rem), Medium
```

### Utility Classes
```tsx
<h1 className="text-page-title">Page Title</h1>
<h2 className="text-section-header">Section Header</h2>
<p className="text-body">Body text content</p>
<span className="text-meta">Meta information</span>
```

### Font Weight Usage
- Regular (400): Body text, descriptions
- Medium (500): Labels, meta text, subtle emphasis
- Semibold (600): Headers, titles, important UI elements
- **Never use Bold (700)** - too heavy for this UI

---

## Spacing System

### 8px Grid
All spacing must be multiples of 8px:

```css
--spacing-1:  8px   (0.5rem)
--spacing-2:  16px  (1rem)
--spacing-3:  24px  (1.5rem)  ← Section padding
--spacing-4:  32px  (2rem)
--spacing-5:  40px  (2.5rem)
```

### Component Padding
- **Cards**: 16-20px (prefer 20px)
- **Buttons**: 12px vertical, 16px horizontal (default)
- **Inputs**: 12px vertical, 12px horizontal
- **Page margins**: 24px

### Vertical Rhythm
Prioritize vertical breathing room:
- Between sections: 24-32px
- Between cards: 16-24px
- Between form fields: 16px
- Inside cards (between elements): 12-16px

---

## Border Radius

```css
Cards:          12px  (rounded-[12px])
Buttons:        10px  (rounded-[10px])
Inputs:         10px  (rounded-[10px])
Small elements: 6-8px (badges, chips)
Avatars:        50%   (circular)
```

**CSS Custom Properties**:
```css
--radius:        0.75rem   /* 12px - cards */
--radius-button: 0.625rem  /* 10px - buttons/inputs */
```

---

## Iconography

### Source
**Lucide Icons** (or equivalent clean line icons)

### Sizing
- Default: 20px (w-5 h-5)
- Large: 24px (w-6 h-6)
- Small: 16px (w-4 h-4)

### Usage Rules
- Icons support text, never replace clarity
- Consistent stroke weight throughout
- Always provide aria-labels for standalone icons
- Icon color should match adjacent text color

---

## Shadows

### Elevation System
```css
Card shadow:     shadow-sm
Hover elevation: shadow-md
Modal/Dialog:    shadow-lg
Dropdown:        shadow-lg
```

**Never use heavy shadows** - keep UI flat and calm.

---

## Animations & Transitions

### Duration
- **Standard**: 150ms
- **Range**: 120-180ms
- **Long (rare)**: 200-300ms (only for complex state changes)

### Easing
**Always use**: `ease-out`

### Transition Properties
```css
/* Standard smooth transition for interactive elements */
.transition-smooth {
  transition: all 150ms ease-out;
}
```

### Animation Use Cases
✓ Task completion  
✓ Expand/collapse sections  
✓ Save confirmations  
✓ Theme mode switching  
✗ No decorative animations  
✗ No perpetual motion  

### Micro-delight
- Subtle checkmark pulse on completion
- Gentle toast messages
- No confetti except for rare, meaningful milestones
- Glow effects for focused states

---

## Component Guidelines

### Buttons

#### Variants
```tsx
<Button variant="default">Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>
<Button variant="destructive">Delete</Button>
```

#### Sizing
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

#### Rules
- Primary actions use `variant="default"`
- Maximum 1 primary button per section
- Secondary actions use `variant="outline"`
- Destructive actions require confirmation
- Icon-only buttons must have aria-label

### Cards

#### Structure
```tsx
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>
    Main content area
  </CardContent>
</Card>
```

#### Rules
- Use for grouping related information
- Maintain consistent padding (20px)
- Avoid nested cards (use dividers instead)
- Keep card heights balanced in grid layouts

### Inputs & Forms

#### Field Structure
```tsx
<div className="space-y-2">
  <Label htmlFor="field">Field Label</Label>
  <Input id="field" placeholder="Placeholder text" />
  <p className="text-meta text-muted-foreground">Helper text</p>
</div>
```

#### Rules
- Labels always above inputs
- Helper text below inputs (12px, muted)
- Error messages use calm language
- Focus states clearly visible (ring-2)

---

## Layout Patterns

### Page Structure
```tsx
<div className="space-y-6">
  {/* Page Header */}
  <section>
    <h1 className="text-page-title">Page Title</h1>
    <p className="mt-1 text-body text-muted-foreground">
      Description of this page or section
    </p>
  </section>

  {/* Primary Content */}
  <section>
    <Card>...</Card>
  </section>
</div>
```

### Grid Layouts
- Use CSS Grid for complex layouts
- Prefer `gap-4` or `gap-6` (16px or 24px)
- Responsive breakpoints: sm, md, lg, xl

---

## Language & Tone

### Voice
- **Calm**: Never shout, never urgent unless truly critical
- **Professional**: Respectful, factual, adult
- **Human**: Warm but not casual
- **Non-judgmental**: No blame, no shame

### Examples

#### ❌ Avoid
- "Error occurred!"
- "Invalid input"
- "Failed to save"
- "Oops! Something went wrong"

#### ✓ Prefer
- "Something didn't save. Try again."
- "We couldn't find that."
- "This field needs attention."
- "Saved. Good work."

### Empty States
```tsx
<p className="text-body text-muted-foreground">
  No tasks yet. The system will track them here when you create one.
</p>
```

### Success Messages
```tsx
<Toast title="Saved. Good work." />
<Toast title="Task completed. Nice." />
<Toast title="Changes applied." />
```

---

## Accessibility

### Color Contrast
- All text must meet WCAG AA standards
- Primary text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum

### Focus States
- Always visible (ring-2)
- Use primary color for ring
- Offset by 1-2px for clarity
- Never remove focus outlines

### Interactive Elements
- Minimum 44px touch targets on mobile
- Keyboard navigation fully supported
- Screen reader labels on all controls

---

## Mobile-First Principles

### Design Assumptions
- One-handed use
- Field conditions (outdoor, moving)
- Glance-based interactions

### Touch Targets
- Minimum: 44px × 44px
- Prefer: 48px × 48px
- Critical actions: 52px × 52px

### Progressive Disclosure
- Show primary information first
- Secondary details collapsible or hidden
- Avoid overwhelming mobile screens

---

## Dashboard Design Principles

Every dashboard screen must answer:
1. **Where am I?** (Clear page title, breadcrumbs if nested)
2. **What matters now?** (Primary focus, highlighted)
3. **What's blocking progress?** (Warnings, pending items)

### Rules
- Limit each screen to **ONE primary focus**
- Secondary information should be:
  - Collapsible, OR
  - Visually muted, OR
  - Hidden in detail panels
- Avoid visual noise
- Status indicators should be obvious at a glance

---

## Chat & Communication

### Message Density
- Comfortable reading (not dense like Slack)
- Adequate line height (1.5-1.6)
- Clear message boundaries

### Timestamps
- Subtle but present
- Relative when recent ("2m ago")
- Absolute when old ("Jan 15")

### Input Areas
- Calm and focused
- Placeholder text helpful but brief
- Send button always visible

---

## Do's and Don'ts

### ✓ DO
- Use neutral colors as base (zinc/slate)
- Limit accent colors (max 3 visible)
- Provide clear visual hierarchy
- Show status at a glance
- Use calm, professional language
- Animate purposefully (150ms ease-out)
- Design for one-handed use
- Follow 8px grid rigorously

### ✗ DON'T
- Use bright or loud colors
- Create visual noise
- Add decorative animations
- Use gamification patterns
- Write casual or playful copy
- Create complex nested layouts
- Ignore mobile considerations
- Add spinners everywhere (use skeleton screens)

---

## Theme Switching

### Implementation
- Toggle between "light" and "dark" modes
- Smooth 150ms fade transition
- Persist preference in localStorage
- Apply before hydration (avoid flash)

### Toggle Button
- Sun/Moon icon
- Accessible label
- Prominent in header
- Smooth icon transition

---

## CSS Custom Properties Reference

### Colors
```css
/* Use these variables, not hardcoded hex values */
var(--background)
var(--foreground)
var(--card)
var(--border)
var(--primary)
var(--success)
var(--warning)
var(--muted-foreground)
```

### Spacing
```css
var(--spacing-1)  /* 8px */
var(--spacing-2)  /* 16px */
var(--spacing-3)  /* 24px */
```

### Radius
```css
var(--radius)         /* 12px - cards */
var(--radius-button)  /* 10px - buttons/inputs */
```

---

## Quality Checklist

Before shipping any UI:
- [ ] Colors match specifications exactly
- [ ] Typography uses defined scale
- [ ] Spacing follows 8px grid
- [ ] Border radius: 12px (cards), 10px (buttons/inputs)
- [ ] Animations: 150ms ease-out
- [ ] Theme switching smooth (150ms)
- [ ] Focus states visible
- [ ] Touch targets ≥44px
- [ ] Language calm and professional
- [ ] Mobile responsive
- [ ] Contrast ratios meet WCAG AA
- [ ] No visual noise
- [ ] One primary focus per screen

---

## Getting Help

If unsure about:
- **Colors**: Always use CSS variables, never hardcode
- **Spacing**: Round to nearest 8px multiple
- **Typography**: Use utility classes (.text-page-title, etc.)
- **Animations**: Default to 150ms ease-out
- **Tone**: When in doubt, be more formal

---

**Last Updated**: January 28, 2026  
**Version**: 1.0.0
