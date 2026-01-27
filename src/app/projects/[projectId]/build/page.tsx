"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { ScopeCompletenessStrip } from "@/modules/projects/components/build/ScopeCompletenessStrip";
import { RoomsList } from "@/modules/projects/components/build/RoomsList";
import { RoomScopeBuilder } from "@/modules/projects/components/build/RoomScopeBuilder";
import { ProductPickerModal } from "@/modules/projects/components/build/ProductPickerModal";
import type { Room, RoomScopeItem, ProductDictItem } from "@/modules/projects/types/build";

export default function ProjectBuildPage() {
  // State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [scopeItems, setScopeItems] = useState<RoomScopeItem[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleDateString());

  // Computed values
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || null;
  const roomScopeItems = scopeItems.filter((item) => item.roomId === selectedRoomId);

  // Room handlers
  const handleAddRoom = (name: string) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name,
      order: rooms.length,
    };
    setRooms([...rooms, newRoom]);
    setSelectedRoomId(newRoom.id);
    updateLastUpdated();
  };

  const handleEditRoom = (roomId: string, name: string) => {
    setRooms(rooms.map((r) => (r.id === roomId ? { ...r, name } : r)));
    updateLastUpdated();
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((r) => r.id !== roomId));
    setScopeItems(scopeItems.filter((item) => item.roomId !== roomId));
    if (selectedRoomId === roomId) {
      setSelectedRoomId(rooms[0]?.id || null);
    }
    updateLastUpdated();
  };

  const getRoomItemCount = (roomId: string) => {
    return scopeItems.filter((item) => item.roomId === roomId).length;
  };

  // Scope item handlers
  const handleProductSelect = (product: ProductDictItem, qty: number) => {
    if (!selectedRoomId) return;

    const newItem: RoomScopeItem = {
      id: `item-${Date.now()}`,
      roomId: selectedRoomId,
      productId: product.id,
      productName: product.name,
      category: product.category,
      qty,
      unit: product.unit,
      notes: "",
    };
    setScopeItems([...scopeItems, newItem]);
    updateLastUpdated();
  };

  const handleUpdateQuantity = (itemId: string, qty: number) => {
    setScopeItems(
      scopeItems.map((item) => (item.id === itemId ? { ...item, qty } : item))
    );
    updateLastUpdated();
  };

  const handleUpdateNotes = (itemId: string, notes: string) => {
    setScopeItems(
      scopeItems.map((item) => (item.id === itemId ? { ...item, notes } : item))
    );
    updateLastUpdated();
  };

  const handleDeleteItem = (itemId: string) => {
    setScopeItems(scopeItems.filter((item) => item.id !== itemId));
    updateLastUpdated();
  };

  const updateLastUpdated = () => {
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // Empty state - no rooms
  if (rooms.length === 0) {
    return (
      <div className="w-full max-w-[1600px] mx-auto space-y-6">
        <ScopeCompletenessStrip
          roomsCount={0}
          itemsCount={0}
          lastUpdated="Not started"
        />

        <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50">
          <Layers className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
            Start Building Your Project
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
            Create your first room to begin defining the scope of this project.
            You'll be able to add items room-wise and build a complete project scope.
          </p>
          <RoomsList
            rooms={[]}
            selectedRoomId={null}
            onRoomSelect={() => {}}
            onAddRoom={handleAddRoom}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
            getRoomItemCount={getRoomItemCount}
          />
        </div>
      </div>
    );
  }

  // Main layout - two panel
  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6">
      {/* Completeness Strip */}
      <ScopeCompletenessStrip
        roomsCount={rooms.length}
        itemsCount={scopeItems.length}
        lastUpdated={lastUpdated}
      />

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Rooms List (Desktop: 3 cols, Mobile: full width) */}
        <div className="lg:col-span-3">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-4 h-[700px]">
            <RoomsList
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              onRoomSelect={setSelectedRoomId}
              onAddRoom={handleAddRoom}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
              getRoomItemCount={getRoomItemCount}
            />
          </div>
        </div>

        {/* Right Panel: Room Scope Builder (Desktop: 9 cols, Mobile: full width) */}
        <div className="lg:col-span-9">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/70 p-6 h-[700px]">
            <RoomScopeBuilder
              room={selectedRoom}
              items={roomScopeItems}
              onAddItemClick={() => setProductPickerOpen(true)}
              onUpdateQuantity={handleUpdateQuantity}
              onUpdateNotes={handleUpdateNotes}
              onDeleteItem={handleDeleteItem}
            />
          </div>
        </div>
      </div>

      {/* Product Picker Modal */}
      <ProductPickerModal
        open={productPickerOpen}
        onOpenChange={setProductPickerOpen}
        onProductSelect={handleProductSelect}
      />
    </div>
  );
}
