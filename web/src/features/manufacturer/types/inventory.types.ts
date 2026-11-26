
export interface InventoryItem {
  inventoryId: string;
  productId: string;

  quantityOnHand: number;
  quantityReserved: number;
  minimumStockLevel: number;

  updatedAt: string;
}

// Available stock is calculated, not stored in the database.
export const getAvailableStock = (item: InventoryItem): number => {
  return item.quantityOnHand - item.quantityReserved;
};
