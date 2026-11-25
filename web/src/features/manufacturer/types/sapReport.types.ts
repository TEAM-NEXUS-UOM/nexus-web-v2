export type SapReportStatus =
    | "PENDING"
    | "IN_PROGRESS"
    | "ACCEPTED"
    | "PARTIALLY_ACCEPTED"
    | "REJECTED";

export type SapReportItemStatus =
    | "PENDING"
    | "ACCEPTED"
    | "PARTIALLY_ACCEPTED"
    | "REJECTED";

export type SapReportStockDecision =
    | "PENDING"
    | "ACCEPTED"
    | "PARTIALLY_ACCEPTED"
    | "REJECTED";

export interface SapReport {
    reportId: string;
    uploadedBy: string;
    fileName: string;
    filePath: string;
    reportDate: string;
    status: SapReportStatus;
    uploadedAt: string;
    updatedAt: string;
}

// One SAP Report Item represents one agency
export interface SapReportItem {
    reportItemId: string;
    reportId: string;
    agencyId: string;
    duePayment: number;
    status: SapReportItemStatus;
}

// Multiple stock items can belong to one agency report item
export interface SapReportItemStock {
    stockItemId: string;
    reportItemId: string;
    productId: string;
    requiredQuantity: number;
    allocatedQuantity?: number;
    decision: SapReportStockDecision;
    rejectionReason?: string;
}