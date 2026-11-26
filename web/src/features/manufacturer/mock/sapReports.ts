
import type {
    SapReport,
    SapReportItem,
    SapReportItemStock,
} from "../types/sapReport.types";

export const mockSapReports: SapReport[] = [
    {
        reportId: "SAP001",
        uploadedBy: "Kamal",
        fileName: "November_Orders.xlsx",
        filePath: "/uploads/November_Orders.xlsx",
        reportDate: "2026-11-24",
        status: "PENDING",
        uploadedAt: "2026-11-24T08:30:00Z",
        updatedAt: "2026-11-24T08:30:00Z",
    },
    {
        reportId: "SAP002",
        uploadedBy: "Kamal",
        fileName: "October_Orders.xlsx",
        filePath: "/uploads/October_Orders.xlsx",
        reportDate: "2026-11-20",
        status: "ACCEPTED",
        uploadedAt: "2026-11-20T09:15:00Z",
        updatedAt: "2026-11-20T11:00:00Z",
    },
];

// One record per agency in a SAP report
export const mockSapReportItems: SapReportItem[] = [
    {
        reportItemId: "ITEM001",
        reportId: "SAP001",
        agencyId: "1",
        duePayment: 250000,
        status: "PENDING",
    },
    {
        reportItemId: "ITEM002",
        reportId: "SAP001",
        agencyId: "2",
        duePayment: 90000,
        status: "PENDING",
    },
    {
        reportItemId: "ITEM003",
        reportId: "SAP002",
        agencyId: "1",
        duePayment: 80000,
        status: "ACCEPTED",
    },
];

// Multiple stock items can belong to one agency report item
export const mockSapReportItemStocks: SapReportItemStock[] = [
    // ITEM001 - Lanka Distributors
    {
        stockItemId: "STOCK001",
        reportItemId: "ITEM001",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789001",
        requiredQuantity: 500,
        decision: "PENDING",
    },
    {
        stockItemId: "STOCK002",
        reportItemId: "ITEM001",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789002",
        requiredQuantity: 200,
        decision: "PENDING",
    },
    {
        stockItemId: "STOCK003",
        reportItemId: "ITEM001",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789003",
        requiredQuantity: 100,
        decision: "PENDING",
    },

    // ITEM002 - Kamal Distributors
    {
        stockItemId: "STOCK004",
        reportItemId: "ITEM002",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789001",
        requiredQuantity: 300,
        decision: "PENDING",
    },
    {
        stockItemId: "STOCK005",
        reportItemId: "ITEM002",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789004",
        requiredQuantity: 150,
        decision: "PENDING",
    },

    // ITEM003 - Lanka Distributors (October report)
    {
        stockItemId: "STOCK006",
        reportItemId: "ITEM003",
        productId: "p1a2b3c4-e5f6-4789-8123-123456789003",
        requiredQuantity: 200,
        decision: "ACCEPTED",
    },
];
