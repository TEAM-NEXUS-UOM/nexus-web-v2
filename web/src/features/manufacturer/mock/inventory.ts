
import type { InventoryItem } from "../types/inventory.types";

export const mockInventory: InventoryItem[] = [
  {
    inventoryId: "INV001",
    productId: "p1a2b3c4-e5f6-4789-8123-123456789001",
    quantityOnHand: 1200,
    quantityReserved: 300,
    minimumStockLevel: 200,
    updatedAt: "2026-11-24T09:30:00Z",
  },
  {
    inventoryId: "INV002",
    productId: "p1a2b3c4-e5f6-4789-8123-123456789002",
    quantityOnHand: 500,
    quantityReserved: 350,
    minimumStockLevel: 200,
    updatedAt: "2026-11-24T10:15:00Z",
  },
  {
    inventoryId: "INV003",
    productId: "p1a2b3c4-e5f6-4789-8123-123456789003",
    quantityOnHand: 800,
    quantityReserved: 200,
    minimumStockLevel: 150,
    updatedAt: "2026-11-24T11:00:00Z",
  },
  {
    inventoryId: "INV004",
    productId: "p1a2b3c4-e5f6-4789-8123-123456789004",
    quantityOnHand: 300,
    quantityReserved: 250,
    minimumStockLevel: 100,
    updatedAt: "2026-11-24T11:45:00Z",
  },
];
