
import type { StockMovement } from "../types/stockMovement.types";

export const mockStockMovements: StockMovement[] = [
    {
        movementId: "MOV001",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789001",
        performedBy: "ADMIN001",
        movementType: "STOCK_IN",
        quantity: 500,
        referenceType: null,
        referenceId: null,
        note: "New rice stock received",
        createdAt: "2026-11-24T08:30:00Z",
    },
    {
        movementId: "MOV002",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789002",
        performedBy: "ADMIN001",
        movementType: "RESERVATION",
        quantity: 100,
        referenceType: "AGENCY_ORDER",
        referenceId: "ORDER001",
        note: "Stock reserved for agency order",
        createdAt: "2026-11-24T09:15:00Z",
    },
    {
        movementId: "MOV003",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789003",
        performedBy: "ADMIN001",
        movementType: "ADJUSTMENT",
        quantity: 20,
        referenceType: null,
        referenceId: null,
        note: "Stock quantity correction",
        createdAt: "2026-11-24T10:00:00Z",
    },
    {
        movementId: "MOV004",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789004",
        performedBy: "ADMIN001",
        movementType: "STOCK_OUT",
        quantity: 50,
        referenceType: "AGENCY_ORDER",
        referenceId: "ORDER002",
        note: "Stock issued for confirmed order",
        createdAt: "2026-11-24T11:30:00Z",
    },
];
