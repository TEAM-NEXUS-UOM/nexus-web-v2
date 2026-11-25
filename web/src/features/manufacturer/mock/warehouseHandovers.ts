
import type {
    WarehouseHandover,
    WarehouseHandoverItem,
} from "../types/warehouseHandover.types";

export const mockWarehouseHandovers: WarehouseHandover[] = [
    {
        handoverId: "HANDOVER001",
        handoverReference: "WH-2026-001",
        reportId: "SAP001",
        warehouseId: "WAREHOUSE001",
        handedOverBy: "ADMIN001",
        receivedBy: null,
        status: "SENT",
        sentAt: "2026-11-24T12:00:00Z",
        receivedAt: null,
        createdAt: "2026-11-24T11:30:00Z",
    },
    {
        handoverId: "HANDOVER002",
        handoverReference: "WH-2026-002",
        reportId: "SAP002",
        warehouseId: "WAREHOUSE001",
        handedOverBy: "ADMIN001",
        receivedBy: "WAREHOUSEADMIN001",
        status: "RECEIVED",
        sentAt: "2026-11-20T10:00:00Z",
        receivedAt: "2026-11-20T10:30:00Z",
        createdAt: "2026-11-20T09:45:00Z",
    },
];

export const mockWarehouseHandoverItems: WarehouseHandoverItem[] = [
    {
        handoverItemId: "HANDOVERITEM001",
        handoverId: "HANDOVER001",
        orderItemId: "ORDERITEM001",
        quantity: 300,
    },
    {
        handoverItemId: "HANDOVERITEM002",
        handoverId: "HANDOVER001",
        orderItemId: "ORDERITEM002",
        quantity: 200,
    },
    {
        handoverItemId: "HANDOVERITEM003",
        handoverId: "HANDOVER002",
        orderItemId: "ORDERITEM003",
        quantity: 150,
    },
];
