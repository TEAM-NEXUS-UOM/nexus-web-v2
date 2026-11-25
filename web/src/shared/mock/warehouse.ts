import type { Warehouse } from '../types/warehouse.types.ts';

export const mockWarehouses: Warehouse[] = [
  {
    warehouseId: "a1000000-0000-4000-8000-000000000001",
    warehouseCode: "W-001",
    warehouseName: "Colombo Main Warehouse",
    address: "Colombo, Sri Lanka",
    contactNumber: "0112345678",
    latitude: 6.9271,
    longitude: 79.8612,
    isActive: true,
    createdAt: "2026-11-01T08:00:00Z",
  },
  {
    warehouseId: "a1000000-0000-4000-8000-000000000002",
    warehouseCode: "W-002",
    warehouseName: "Kandy Distribution Warehouse",
    address: "Kandy, Sri Lanka",
    contactNumber: "0812345678",
    latitude: 7.2906,
    longitude: 80.6337,
    isActive: true,
    createdAt: "2026-11-05T08:00:00Z",
  },
  {
    warehouseId: "a1000000-0000-4000-8000-000000000003",
    warehouseCode: "W-003",
    warehouseName: "Galle Regional Warehouse",
    address: "Galle, Sri Lanka",
    contactNumber: "0912345678",
    latitude: 6.0535,
    longitude: 80.2210,
    isActive: false,
    createdAt: "2026-11-10T08:00:00Z",
  },
];