
export type WarehouseHandoverStatus =
    | "DRAFT"
    | "SENT"
    | "RECEIVED"
    | "REJECTED";

export interface WarehouseHandover {
    handoverId: string;
    handoverReference: string;
    reportId: string;
    warehouseId: string;
    handedOverBy: string;
    receivedBy: string | null;
    status: WarehouseHandoverStatus;
    sentAt: string | null;
    receivedAt: string | null;
    createdAt: string;
}

export interface WarehouseHandoverItem {
    handoverItemId: string;
    handoverId: string;
    orderItemId: string;
    quantity: number;
}
