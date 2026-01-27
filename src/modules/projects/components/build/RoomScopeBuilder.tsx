"use client";

import { useState } from "react";
import { Plus, Minus, Edit3, Trash2, StickyNote, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import type { Room, RoomScopeItem } from "../../types/build";

interface RoomScopeBuilderProps {
  room: Room | null;
  items: RoomScopeItem[];
  onAddItemClick: () => void;
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onUpdateNotes: (itemId: string, notes: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export function RoomScopeBuilder({
  room,
  items,
  onAddItemClick,
  onUpdateQuantity,
  onUpdateNotes,
  onDeleteItem,
}: RoomScopeBuilderProps) {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingQty, setEditingQty] = useState("");
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notesItem, setNotesItem] = useState<RoomScopeItem | null>(null);
  const [notesText, setNotesText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<RoomScopeItem | null>(null);

  const handleQtyEdit = (item: RoomScopeItem) => {
    setEditingItemId(item.id);
    setEditingQty(item.qty.toString());
  };

  const handleQtySave = (itemId: string) => {
    const qty = parseInt(editingQty);
    if (!isNaN(qty) && qty > 0) {
      onUpdateQuantity(itemId, qty);
    }
    setEditingItemId(null);
    setEditingQty("");
  };

  const handleQtyChange = (itemId: string, delta: number) => {
    const item = items.find((i) => i.id === itemId);
    if (item) {
      const newQty = Math.max(1, item.qty + delta);
      onUpdateQuantity(itemId, newQty);
    }
  };

  const openNotesDialog = (item: RoomScopeItem) => {
    setNotesItem(item);
    setNotesText(item.notes || "");
    setNotesDialogOpen(true);
  };

  const handleNotesSave = () => {
    if (notesItem) {
      onUpdateNotes(notesItem.id, notesText.trim());
    }
    setNotesDialogOpen(false);
    setNotesItem(null);
    setNotesText("");
  };

  const openDeleteDialog = (item: RoomScopeItem) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (deletingItem) {
      onDeleteItem(deletingItem.id);
    }
    setDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Package className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          No Room Selected
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Select a room from the list to start building its scope
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {room.name}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {items.length} {items.length === 1 ? "item" : "items"} in scope
          </p>
        </div>
        <Button onClick={onAddItemClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Items List */}
      {items.length > 0 ? (
        <div className="flex-1 space-y-3 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="group rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <h4 className="font-medium text-zinc-900 dark:text-zinc-50">
                      {item.productName}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      Qty:
                    </span>
                    {editingItemId === item.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min="1"
                          value={editingQty}
                          onChange={(e) => setEditingQty(e.target.value)}
                          onBlur={() => handleQtySave(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleQtySave(item.id);
                            if (e.key === "Escape") {
                              setEditingItemId(null);
                              setEditingQty("");
                            }
                          }}
                          className="h-7 w-16 text-sm"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => handleQtyChange(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <button
                          onClick={() => handleQtyEdit(item)}
                          className="px-2 py-1 min-w-[40px] text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                        >
                          {item.qty}
                        </button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0"
                          onClick={() => handleQtyChange(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">
                          {item.unit || "nos"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes Indicator */}
                  {item.notes && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1">
                      <StickyNote className="h-3 w-3 inline mr-1" />
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "h-7 w-7 p-0",
                      item.notes
                        ? "text-amber-600 hover:text-amber-700"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                    onClick={() => openNotesDialog(item)}
                  >
                    {item.notes ? (
                      <StickyNote className="h-4 w-4 fill-current" />
                    ) : (
                      <Edit3 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => openDeleteDialog(item)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-3" />
          <h4 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">
            No items yet
          </h4>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Add items to define the scope for this room
          </p>
          <Button onClick={onAddItemClick} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add First Item
          </Button>
        </div>
      )}

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Notes</DialogTitle>
            <DialogDescription>
              {notesItem?.productName && (
                <span className="block mt-1 font-medium text-zinc-700 dark:text-zinc-300">
                  {notesItem.productName}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Add installation notes, specifications, or requirements..."
            value={notesText}
            onChange={(e) => setNotesText(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNotesDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleNotesSave}>Save Notes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{deletingItem?.productName}" from{" "}
              {room.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
