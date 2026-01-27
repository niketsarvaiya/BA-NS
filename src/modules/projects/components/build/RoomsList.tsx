"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { Room } from "../../types/build";

interface RoomsListProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  onAddRoom: (name: string) => void;
  onEditRoom: (roomId: string, name: string) => void;
  onDeleteRoom: (roomId: string) => void;
  getRoomItemCount: (roomId: string) => number;
}

export function RoomsList({
  rooms,
  selectedRoomId,
  onRoomSelect,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  getRoomItemCount,
}: RoomsListProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const handleAddRoom = () => {
    if (roomName.trim()) {
      onAddRoom(roomName.trim());
      setRoomName("");
      setAddDialogOpen(false);
    }
  };

  const handleEditRoom = () => {
    if (editingRoom && roomName.trim()) {
      onEditRoom(editingRoom.id, roomName.trim());
      setRoomName("");
      setEditingRoom(null);
      setEditDialogOpen(false);
    }
  };

  const handleDeleteRoom = () => {
    if (deletingRoom) {
      onDeleteRoom(deletingRoom.id);
      setDeletingRoom(null);
      setDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setRoomName(room.name);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (room: Room) => {
    setDeletingRoom(room);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Rooms
        </h2>
        <Button
          size="sm"
          onClick={() => setAddDialogOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Rooms List */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {rooms.map((room) => {
          const itemCount = getRoomItemCount(room.id);
          const isSelected = room.id === selectedRoomId;

          return (
            <div
              key={room.id}
              className={cn(
                "group relative rounded-lg border p-3 transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
              onClick={() => onRoomSelect(room.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-medium truncate",
                      isSelected
                        ? "text-primary"
                        : "text-zinc-900 dark:text-zinc-50"
                    )}
                  >
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    <Package className="h-3 w-3" />
                    <span>
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(room);
                    }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(room);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {rooms.length === 0 && (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            <p className="text-sm">No rooms yet</p>
            <p className="text-xs mt-1">Click "Add Room" to get started</p>
          </div>
        )}
      </div>

      {/* Add Room Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Enter a name for the room (e.g., Living Room, Master Bedroom)
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddRoom();
            }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRoom} disabled={!roomName.trim()}>
              Add Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room Name</DialogTitle>
            <DialogDescription>
              Change the name of this room
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditRoom();
            }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRoom} disabled={!roomName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingRoom?.name}"? All items
              in this room will also be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoom}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
