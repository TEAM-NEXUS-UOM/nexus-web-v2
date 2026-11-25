import type { Product } from "./product.types";


export interface InventoryItem {
  inventoryItemId: string;
  warehouseId: string;
  productId: string;
  quantityOnHand: number;
  reservedQuantity: number;
  reorderLevel: number;
  updatedAt: string;
}

// Quantity that is currently available for dispatch
export const getAvailableQuantity = (
  item: InventoryItem
): number => {
  return item.quantityOnHand - item.reservedQuantity;
}


export interface InventoryItemWithProduct extends InventoryItem {
  product?: Product;
}

export interface CreateInventoryItemDTO {
  warehouseId: string;
  productId: string;
  quantityOnHand: number;
  reservedQuantity?: number;
  reorderLevel: number;
}


export interface UpdateInventoryItemDTO {
  quantityOnHand?: number;
  reservedQuantity?: number;
  reorderLevel?: number;
}


export type InventoryStatus =
  | "IN_STOCK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK";