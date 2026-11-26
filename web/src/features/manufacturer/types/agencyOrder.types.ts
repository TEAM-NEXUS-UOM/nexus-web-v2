
export type AgencyOrderStatus =
    | "DRAFT"
    | "CONFIRMED"
    | "HANDED_OVER"
    | "DISPATCHED"
    | "CANCELLED";

export interface AgencyOrder {
    orderId: string;
    reportId: string;
    agencyId: string;
    createdBy: string;
    status: AgencyOrderStatus;
    createdAt: string;
    updatedAt: string;
}

export interface AgencyOrderItem {
    orderItemId: string;
    orderId: string;
    productId: string;
    requestedQty: number;
    allocatedQty: number;
}
