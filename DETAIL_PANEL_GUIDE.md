# Universal DetailPanel Component Guide

## Overview
The `DetailPanel` component provides a consistent right-side panel UI for displaying detailed information across different modules (Activity, BOQ, Tasks, etc.).

## Location
`src/components/ui/detail-panel.tsx`

## Features
- ✅ Fixed positioning below top navigation (top: 64px / 4rem)
- ✅ Semi-transparent backdrop with blur
- ✅ Responsive widths (sm: 400px, md: 600px, lg: 800px)
- ✅ Sticky header with icon, title, subtitle, and close button
- ✅ Scrollable content area
- ✅ Consistent z-index layering (backdrop: z-30, panel: z-40)

## Basic Usage

```tsx
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <DetailPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Item Title"
      subtitle="Optional subtitle"
      icon={<SomeIcon />}
      width="md" // sm | md | lg
    >
      <div className="space-y-6">
        <DetailPanelSection 
          title="Section Title" 
          icon={<Icon />}
        >
          Your content here
        </DetailPanelSection>
      </div>
    </DetailPanel>
  );
}
```

## Implementation Examples

### 1. BOQ Line Item Detail Panel

**Requirement:** Show complete lifecycle from inception to QC

```tsx
// src/modules/projects/components/boq/BOQItemDetailPanel.tsx
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";
import { Package, History, MapPin, ClipboardCheck } from "lucide-react";

interface BOQItemDetailPanelProps {
  boqItem: BOQItem;
  onClose: () => void;
}

export function BOQItemDetailPanel({ boqItem, onClose }: BOQItemDetailPanelProps) {
  return (
    <DetailPanel
      isOpen={true}
      onClose={onClose}
      title={boqItem.productName}
      subtitle={`BOQ Item • ${boqItem.category}`}
      icon={<Package className="h-10 w-10 text-indigo-600" />}
      width="lg"
    >
      <div className="space-y-6">
        {/* Basic Details */}
        <div className="grid grid-cols-2 gap-4">
          <DetailPanelSection title="Quantity" icon={<Package />}>
            <div className="text-2xl font-semibold">{boqItem.totalQty}</div>
          </DetailPanelSection>
          
          <DetailPanelSection title="Area Assignment" icon={<MapPin />}>
            <div>{boqItem.area}</div>
          </DetailPanelSection>
        </div>

        {/* Lifecycle Timeline */}
        <DetailPanelSection title="Item Lifecycle" icon={<History />}>
          <div className="space-y-3">
            {/* Inception */}
            <TimelineItem
              status="completed"
              title="Added to BOQ"
              date="Jan 15, 2026"
              actor="Neha Gupta"
            />
            
            {/* Procurement */}
            <TimelineItem
              status="completed"
              title="Material Dispatched"
              date="Jan 20, 2026"
              actor="Store Team"
            />
            
            <TimelineItem
              status="completed"
              title="Material Delivered"
              date="Jan 22, 2026"
              actor="Store Team"
            />
            
            {/* Installation */}
            <TimelineItem
              status="in-progress"
              title="Installation Started"
              date="Jan 25, 2026"
              actor="Rakesh Kumar"
            />
            
            {/* QC */}
            <TimelineItem
              status="pending"
              title="QC Check"
              date="Pending"
            />
          </div>
        </DetailPanelSection>

        {/* Room Allocations */}
        <DetailPanelSection title="Room Allocations">
          {boqItem.allocations.map((alloc) => (
            <div key={alloc.id} className="border-b pb-2">
              <div>{alloc.roomName} - {alloc.qty} units</div>
              <div className="text-xs text-slate-500">
                Status: {alloc.installationStatus}
              </div>
            </div>
          ))}
        </DetailPanelSection>

        {/* QC Notes */}
        <DetailPanelSection title="QC Notes" icon={<ClipboardCheck />}>
          {boqItem.qcNotes?.map((note) => (
            <div key={note.id} className="bg-slate-50 p-3 rounded">
              <div className="text-sm">{note.text}</div>
              <div className="text-xs text-slate-500 mt-1">
                {note.date} - {note.actor}
              </div>
            </div>
          ))}
        </DetailPanelSection>
      </div>
    </DetailPanel>
  );
}
```

### 2. Task Detail Panel

**Requirement:** Logs, helpers, subtasks, comments

```tsx
// src/modules/tasks/components/TaskDetailPanel.tsx
import { DetailPanel, DetailPanelSection } from "@/components/ui/detail-panel";
import { CheckCircle, BookOpen, List, MessageSquare, History } from "lucide-react";

interface TaskDetailPanelProps {
  task: ProjectTask;
  onClose: () => void;
}

export function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  return (
    <DetailPanel
      isOpen={true}
      onClose={onClose}
      title={task.title}
      subtitle={`Task • ${task.stakeholder}`}
      icon={<CheckCircle className="h-10 w-10 text-green-600" />}
      width="lg"
    >
      <div className="space-y-6">
        {/* Basic Details */}
        <div className="grid grid-cols-3 gap-4">
          <DetailPanelSection title="Status">
            <StatusBadge status={task.status} />
          </DetailPanelSection>
          
          <DetailPanelSection title="Priority">
            <PriorityBadge priority={task.priority} />
          </DetailPanelSection>
          
          <DetailPanelSection title="Assigned To">
            <div>{task.assignedTo}</div>
          </DetailPanelSection>
        </div>

        {/* Description */}
        <DetailPanelSection title="Description">
          <p className="text-sm">{task.description}</p>
        </DetailPanelSection>

        {/* Helpers & Tutorials */}
        <DetailPanelSection title="Helpful Resources" icon={<BookOpen />}>
          <div className="space-y-2">
            <button className="w-full text-left p-3 bg-blue-50 rounded hover:bg-blue-100">
              📘 How to install keypads
            </button>
            <button className="w-full text-left p-3 bg-blue-50 rounded hover:bg-blue-100">
              🎥 Video tutorial: Keypad programming
            </button>
            <button className="w-full text-left p-3 bg-blue-50 rounded hover:bg-100">
              📋 Checklist: Pre-installation requirements
            </button>
          </div>
        </DetailPanelSection>

        {/* Subtasks */}
        <DetailPanelSection title="Subtasks (3/5)" icon={<List />}>
          <div className="space-y-2">
            <SubtaskItem 
              title="Verify power supply" 
              completed={true}
            />
            <SubtaskItem 
              title="Mount keypad plates" 
              completed={true}
            />
            <SubtaskItem 
              title="Wire connections" 
              completed={true}
            />
            <SubtaskItem 
              title="Install keypads" 
              completed={false}
            />
            <SubtaskItem 
              title="Test functionality" 
              completed={false}
            />
          </div>
        </DetailPanelSection>

        {/* Activity Log */}
        <DetailPanelSection title="Activity Log" icon={<History />}>
          <div className="space-y-3">
            <LogItem
              action="Status changed to In Progress"
              actor="Amit Patel"
              timestamp="2 hours ago"
            />
            <LogItem
              action="Task assigned to Rakesh Kumar"
              actor="Amit Patel"
              timestamp="1 day ago"
            />
            <LogItem
              action="Task created"
              actor="System"
              timestamp="3 days ago"
            />
          </div>
        </DetailPanelSection>

        {/* Comments */}
        <DetailPanelSection title="Comments (3)" icon={<MessageSquare />}>
          <div className="space-y-4">
            {task.comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-slate-200 pl-3">
                <div className="text-sm">{comment.text}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {comment.author} • {comment.timestamp}
                </div>
              </div>
            ))}
            
            {/* Add Comment */}
            <Textarea 
              placeholder="Add a comment..." 
              className="min-h-[80px]"
            />
            <Button size="sm">Post Comment</Button>
          </div>
        </DetailPanelSection>
      </div>
    </DetailPanel>
  );
}
```

## Page Layout Integration

When using DetailPanel, adjust the main content area to prevent overlap:

```tsx
// In your page component
const [selectedItem, setSelectedItem] = useState<string | null>(null);

return (
  <>
    <div className={`transition-all duration-300 ${selectedItem ? 'mr-[800px]' : ''}`}>
      {/* Main content */}
    </div>
    
    {selectedItem && (
      <YourDetailPanel
        item={getItemById(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    )}
  </>
);
```

## Key Design Principles

1. **Backdrop closes panel** - Click outside to close
2. **Close button always visible** - Sticky header with close button
3. **Consistent spacing** - Use `space-y-6` for main sections
4. **Use DetailPanelSection** - Consistent section headers with icons
5. **Scrollable content** - Long content scrolls, header stays fixed
6. **Width guidelines**:
   - `sm` (400px): Quick info, minimal details
   - `md` (600px): Standard detail view
   - `lg` (800px): Complex data with multiple columns

## TODO: Implementation Checklist

- [ ] BOQ Item Detail Panel with lifecycle tracking
- [ ] Task Detail Panel with subtasks and comments
- [ ] Add comment system to Tasks
- [ ] Add subtask management to Tasks
- [ ] BOQ lifecycle timeline events integration
- [ ] Task helper/tutorial content system
