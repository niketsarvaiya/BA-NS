import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Area, Room } from "../../types/boq";
import { AREAS } from "../../types/boq";

interface AreaSelectProps {
  value?: Area;
  onChange: (value: Area) => void;
  placeholder?: string;
}

export function AreaSelect({ value, onChange, placeholder = "Select area" }: AreaSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn("w-[140px]", !value && "border-amber-500 dark:border-amber-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {AREAS.map((area) => (
            <SelectItem key={area} value={area}>
              {area}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!value && (
        <Badge variant="warning" className="text-xs whitespace-nowrap">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Required
        </Badge>
      )}
    </div>
  );
}

interface RoomSelectProps {
  value?: string;
  onChange: (value: string) => void;
  rooms: Room[];
  placeholder?: string;
}

export function RoomSelect({ value, onChange, rooms, placeholder = "Select room" }: RoomSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {rooms.map((room) => (
          <SelectItem key={room.id} value={room.id}>
            {room.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface AllocationProgressBadgeProps {
  allocated: number;
  total: number;
}

export function AllocationProgressBadge({ allocated, total }: AllocationProgressBadgeProps) {
  const percentage = total > 0 ? (allocated / total) * 100 : 0;
  const isComplete = allocated === total;
  const isPending = allocated === 0;

  return (
    <Badge
      variant={isComplete ? "success" : isPending ? "warning" : "muted"}
      className="text-xs font-medium"
    >
      {allocated}/{total} allocated
    </Badge>
  );
}
