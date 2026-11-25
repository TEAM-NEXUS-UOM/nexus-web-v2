import type { InventoryItem } from "../types/inventoryItem.types";
import { mockInventory } from "../mock/inventoryItem";

export const getInventory = (): InventoryItem[] => {
  return mockInventory;
};

export const getInventoryByWarehouse = (
  warehouseId: string
): InventoryItem[] => {
  return mockInventory.filter((item) => item.warehouseId === warehouseId);
};

export const getInventoryByProduct = (
  productId: string
): InventoryItem[] => {
  return mockInventory.filter((item) => item.productId === productId);
};

export const getInventoryItemById = (
  inventoryItemId: string
): InventoryItem | undefined => {
  return mockInventory.find(
    (item) => item.inventoryItemId === inventoryItemId
  );
};

export const getLowStockItems = (): InventoryItem[] => {
  return mockInventory.filter(
    (item) => item.quantityOnHand - item.reservedQuantity <= item.reorderLevel
  );
};

export const getAvailableQuantity = (item: InventoryItem): number => {
  return item.quantityOnHand - item.reservedQuantity;
};