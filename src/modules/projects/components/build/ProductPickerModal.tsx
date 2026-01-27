"use client";

import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProductDictItem } from "../../types/build";
import {
  PRODUCT_DICTIONARY,
  getAllCategories,
} from "../../utils/mockProductDictionary";

interface ProductPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductSelect: (product: ProductDictItem, qty: number) => void;
}

export function ProductPickerModal({
  open,
  onOpenChange,
  onProductSelect,
}: ProductPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductDictItem | null>(null);
  const [quantity, setQuantity] = useState("1");

  const categories = getAllCategories();

  // Filter products
  const filteredProducts = useMemo(() => {
    let products = PRODUCT_DICTIONARY;

    // Filter by category
    if (selectedCategory !== "all") {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.subCategory?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    return products;
  }, [searchQuery, selectedCategory]);

  // Group by category
  const groupedProducts = useMemo(() => {
    const groups: Record<string, ProductDictItem[]> = {};
    filteredProducts.forEach((product) => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [filteredProducts]);

  const handleProductClick = (product: ProductDictItem) => {
    setSelectedProduct(product);
    setQuantity("1");
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      const qty = parseInt(quantity);
      if (!isNaN(qty) && qty > 0) {
        onProductSelect(selectedProduct, qty);
        setSelectedProduct(null);
        setQuantity("1");
        setSearchQuery("");
        onOpenChange(false);
      }
    }
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setQuantity("1");
    setSearchQuery("");
    setSelectedCategory("all");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Add Item from Product Dictionary</DialogTitle>
          <DialogDescription>
            Search and select products to add to this room
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filter */}
        <div className="px-6 pb-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Active filters:
              </span>
              {searchQuery && (
                <Badge variant="muted" className="gap-1">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="muted" className="gap-1">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Products List */}
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {Object.keys(groupedProducts).length > 0 ? (
              Object.entries(groupedProducts).map(([category, products]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                    {category} ({products.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          selectedProduct?.id === product.id
                            ? "border-primary bg-primary/5 dark:bg-primary/10"
                            : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                                {product.description}
                              </p>
                            )}
                            {product.subCategory && (
                              <Badge
                                variant="outline"
                                className="text-xs mt-2"
                              >
                                {product.subCategory}
                              </Badge>
                            )}
                          </div>
                          {selectedProduct?.id === product.id && (
                            <div className="text-primary">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Plus className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No products found matching your criteria
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Selected Product & Quantity */}
        {selectedProduct && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-50 truncate">
                  {selectedProduct.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedProduct.category}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-600 dark:text-zinc-400">
                  Qty:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddProduct();
                  }}
                  className="w-20 h-9"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedProduct.unit || "nos"}
                </span>
              </div>

              <Button onClick={handleAddProduct} className="gap-2">
                <Plus className="h-4 w-4" />
                Add to Room
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
