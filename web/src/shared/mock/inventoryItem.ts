import type { InventoryItem } from "../types/inventoryItem.types";

export const mockInventory: InventoryItem[] = [
  {
    inventoryItemId: "b1000000-0000-4000-8000-000000000001",
    warehouseId: "a1000000-0000-4000-8000-000000000001",
    productId: "a1000000-0000-4000-8000-000000000001",
    quantityOnHand: 500,
    reservedQuantity: 120,
    reorderLevel: 100,
    updatedAt: "2026-11-25T08:00:00Z",
  },
  {
    inventoryItemId: "b1000000-0000-4000-8000-000000000002",
    warehouseId: "a1000000-0000-4000-8000-000000000001",
    productId: "a1000000-0000-4000-8000-000000000002",
    quantityOnHand: 250,
    reservedQuantity: 50,
    reorderLevel: 80,
    updatedAt: "2026-11-25T08:10:00Z",
  },
  {
    inventoryItemId: "b1000000-0000-4000-8000-000000000003",
    warehouseId: "a1000000-0000-4000-8000-000000000001",
    productId: "a1000000-0000-4000-8000-000000000003",
    quantityOnHand: 80,
    reservedQuantity: 20,
    reorderLevel: 50,
    updatedAt: "2026-11-25T08:15:00Z",
  },
  {
    inventoryItemId: "b1000000-0000-4000-8000-000000000004",
    warehouseId: "a1000000-0000-4000-8000-000000000001",
    productId: "a1000000-0000-4000-8000-000000000004",
    quantityOnHand: 30,
    reservedQuantity: 10,
    reorderLevel: 50,
    updatedAt: "2026-11-25T08:20:00Z",
  },
  {
    inventoryItemId: "b1000000-0000-4000-8000-000000000005",
    warehouseId: "a1000000-0000-4000-8000-000000000001",
    productId: "a1000000-0000-4000-8000-000000000005",
    quantityOnHand: 0,
    reservedQuantity: 0,
    reorderLevel: 40,
    updatedAt: "2026-11-25T08:25:00Z",
  },
];