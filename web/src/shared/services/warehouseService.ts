import type { Warehouse } from "../types/warehouse.types";
import { mockWarehouses } from "../mock/warehouse";

export const getWarehouses = (): Warehouse[] => {
  return mockWarehouses;
};

export const getWarehouseById = (warehouseId: string): Warehouse | undefined => {
  return mockWarehouses.find((warehouse) => warehouse.warehouseId === warehouseId);
};

export const searchWarehouses = (searchTerm: string): Warehouse[] => {
  const term = searchTerm.trim().toLowerCase();

  return mockWarehouses.filter(
    (warehouse) =>
      warehouse.warehouseName.toLowerCase().includes(term) ||
      warehouse.warehouseCode.toLowerCase().includes(term) ||
      warehouse.address.toLowerCase().includes(term)
  );
};

export const getActiveWarehouses = (): Warehouse[] => {
  return mockWarehouses.filter((warehouse) => warehouse.isActive);
};