
import type {
    AgencyOrder,
    AgencyOrderItem,
} from "../types/agencyOrder.types";

export const mockAgencyOrders: AgencyOrder[] = [
    {
        orderId: "ORDER001",
        reportId: "SAP001",
        agencyId: "1",
        createdBy: "ADMIN001",
        status: "CONFIRMED",
        createdAt: "2026-11-24T09:00:00Z",
        updatedAt: "2026-11-24T10:00:00Z",
    },
    {
        orderId: "ORDER002",
        reportId: "SAP001",
        agencyId: "2",
        createdBy: "ADMIN001",
        status: "DRAFT",
        createdAt: "2026-11-24T09:30:00Z",
        updatedAt: "2026-11-24T09:30:00Z",
    },
];

export const mockAgencyOrderItems: AgencyOrderItem[] = [
    {
        orderItemId: "ORDERITEM001",
        orderId: "ORDER001",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789001",
        requestedQty: 500,
        allocatedQty: 300,
    },
    {
        orderItemId: "ORDERITEM002",
        orderId: "ORDER001",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789002",
        requestedQty: 200,
        allocatedQty: 200,
    },
    {
        orderItemId: "ORDERITEM003",
        orderId: "ORDER002",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789003",
        requestedQty: 150,
        allocatedQty: 0,
    },
];
