
import { useState } from "react";

import {
    mockSapReports,
    mockSapReportItems,
    mockSapReportItemStocks,
} from "../mock/sapReports";

import { mockInventory } from "../mock/inventory";

import { mockAgencies } from "../../../shared/mock/agencies";
import { mockProducts } from "../../../shared/mock/products";

import {
    getAvailableStock,
} from "../types/inventory.types";

import type {
    InventoryItem,
} from "../types/inventory.types";

import type {
    SapReport,
    SapReportItem,
    SapReportItemStock,
} from "../types/sapReport.types";

import {
    mockAgencyOrders,
    mockAgencyOrderItems,
} from "../mock/agencyOrders";

import type {
    AgencyOrder,
    AgencyOrderItem,
} from "../types/agencyOrder.types";

type TabType = "reports" | "agencies" | "stocks";

function SapRequirements() {
    const [activeTab, setActiveTab] = useState<TabType>("reports");

    const [selectedReport, setSelectedReport] = useState<SapReport | null>(
        mockSapReports[0] ?? null
    );

    const [selectedReportItemId, setSelectedReportItemId] = useState(
        mockSapReportItems[0]?.reportItemId ?? ""
    );

    const [reportItemsState, setReportItemsState] =
        useState<SapReportItem[]>(mockSapReportItems);

    const [stockItemsState, setStockItemsState] =
        useState<SapReportItemStock[]>(mockSapReportItemStocks);

    const [inventoryState, setInventoryState] =
        useState<InventoryItem[]>(mockInventory);

    const [agencyOrdersState, setAgencyOrdersState] =
        useState<AgencyOrder[]>(mockAgencyOrders);

    const [agencyOrderItemsState, setAgencyOrderItemsState] =
        useState<AgencyOrderItem[]>(mockAgencyOrderItems);

    const [allocationInputs, setAllocationInputs] =
        useState<Record<string, number>>({});

    const [rejectingStockId, setRejectingStockId] =
        useState<string | null>(null);

    const [rejectionReason, setRejectionReason] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // --------------------------------------------------
    // STATUS STYLES
    // --------------------------------------------------

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-amber-100 text-amber-700";

            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700";

            case "ACCEPTED":
                return "bg-green-100 text-green-700";

            case "PARTIALLY_ACCEPTED":
                return "bg-purple-100 text-purple-700";

            case "REJECTED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    // --------------------------------------------------
    // SELECTED DATA
    // --------------------------------------------------

    const reportItems = reportItemsState.filter(
        (item) => item.reportId === selectedReport?.reportId
    );

    const selectedReportItem = reportItemsState.find(
        (item) => item.reportItemId === selectedReportItemId
    );

    const stockItems = stockItemsState.filter(
        (item) => item.reportItemId === selectedReportItemId
    );

    // --------------------------------------------------
    // CALCULATE AGENCY STATUS
    // --------------------------------------------------

    const calculateAgencyStatus = (
        reportItemId: string,
        stocks: SapReportItemStock[]
    ): SapReportItem["status"] => {
        const items = stocks.filter(
            (stock) => stock.reportItemId === reportItemId
        );

        if (items.length === 0) {
            return "PENDING";
        }

        if (items.some((item) => item.decision === "PENDING")) {
            return "PENDING";
        }

        const allRejected = items.every(
            (item) => item.decision === "REJECTED"
        );

        if (allRejected) {
            return "REJECTED";
        }

        const allAccepted = items.every(
            (item) => item.decision === "ACCEPTED"
        );

        if (allAccepted) {
            return "ACCEPTED";
        }

        return "PARTIALLY_ACCEPTED";
    };

    // --------------------------------------------------
    // CALCULATE REPORT STATUS
    // --------------------------------------------------

    const calculateReportStatus = (
        reportId: string
    ): SapReport["status"] => {
        const items = reportItemsState.filter(
            (item) => item.reportId === reportId
        );

        if (items.length === 0) {
            return "PENDING";
        }

        if (items.every((item) => item.status === "PENDING")) {
            return "PENDING";
        }

        if (items.some((item) => item.status === "PENDING")) {
            return "IN_PROGRESS";
        }

        if (items.every((item) => item.status === "ACCEPTED")) {
            return "ACCEPTED";
        }

        if (items.every((item) => item.status === "REJECTED")) {
            return "REJECTED";
        }

        return "PARTIALLY_ACCEPTED";
    };
    // SYNC AGENCY ORDER
    const syncAgencyOrder = (
        reportItemId: string,
        updatedStocks: SapReportItemStock[]
    ) => {
        const reportItem = reportItemsState.find(
            (item) => item.reportItemId === reportItemId
        );

        if (!reportItem) return;

        const itemStocks = updatedStocks.filter(
            (stock) => stock.reportItemId === reportItemId
        );

        // Wait until every stock item has been reviewed
        if (
            itemStocks.length === 0 ||
            itemStocks.some((stock) => stock.decision === "PENDING")
        ) {
            return;
        }

        // Only allocated stock items become order items
        const allocatedStocks = itemStocks.filter(
            (stock) => (stock.allocatedQuantity ?? 0) > 0
        );

        const existingOrder = agencyOrdersState.find(
            (order) =>
                order.reportId === reportItem.reportId &&
                order.agencyId === reportItem.agencyId
        );

        // No order should exist if everything was rejected
        if (allocatedStocks.length === 0) {
            if (existingOrder) {
                setAgencyOrdersState((prev) =>
                    prev.filter(
                        (order) => order.orderId !== existingOrder.orderId
                    )
                );

                setAgencyOrderItemsState((prev) =>
                    prev.filter(
                        (item) => item.orderId !== existingOrder.orderId
                    )
                );
            }

            return;
        }

        const now = new Date().toISOString();

        const orderId = existingOrder?.orderId ?? `ORDER-${reportItemId}`;

        const updatedOrder: AgencyOrder = {
            orderId,
            reportId: reportItem.reportId,
            agencyId: reportItem.agencyId,
            createdBy: existingOrder?.createdBy ?? "ADMIN001",
            status: "CONFIRMED",
            createdAt: existingOrder?.createdAt ?? now,
            updatedAt: now,
        };

        if (existingOrder) {
            setAgencyOrdersState((prev) =>
                prev.map((order) =>
                    order.orderId === orderId ? updatedOrder : order
                )
            );
        } else {
            setAgencyOrdersState((prev) => [...prev, updatedOrder]);
        }

        const newOrderItems: AgencyOrderItem[] = allocatedStocks.map(
            (stock) => ({
                orderItemId: `ORDERITEM-${stock.stockItemId}`,
                orderId,
                productId: stock.productId,
                requestedQty: stock.requiredQuantity,
                allocatedQty: stock.allocatedQuantity ?? 0,
            })
        );

        // Replace existing items with the latest allocations
        setAgencyOrderItemsState((prev) => [
            ...prev.filter((item) => item.orderId !== orderId),
            ...newOrderItems,
        ]);
    };

    // --------------------------------------------------
    // UPDATE STOCK DECISION
    // --------------------------------------------------

    const updateStockDecision = (
        stockItemId: string,
        decision: "REJECTED",
        reason: string
    ) => {
        const updatedStocks = stockItemsState.map((stock) =>
            stock.stockItemId === stockItemId
                ? {
                    ...stock,
                    decision,
                    rejectionReason: reason,
                }
                : stock
        );

        setStockItemsState(updatedStocks);

        syncAgencyOrder(
            stockItemsState.find(
                (stock) => stock.stockItemId === stockItemId
            )?.reportItemId ?? "",
            updatedStocks
        );

        setReportItemsState((previousItems) =>
            previousItems.map((item) => ({
                ...item,
                status: calculateAgencyStatus(
                    item.reportItemId,
                    updatedStocks
                ),
            }))
        );

        setRejectingStockId(null);
        setRejectionReason("");
        setSuccessMessage("Stock item rejected successfully.");
        setErrorMessage("");
    };

    // --------------------------------------------------
    // CHANGE ALLOCATION INPUT
    // --------------------------------------------------

    const handleAllocationChange = (
        stockItemId: string,
        value: number
    ) => {
        setAllocationInputs((previous) => ({
            ...previous,
            [stockItemId]: value,
        }));

        setErrorMessage("");
        setSuccessMessage("");
    };

    // --------------------------------------------------
    // SAVE ALLOCATION
    // --------------------------------------------------

    const handleSaveAllocation = () => {
        if (!selectedReportItem) {
            return;
        }

        const itemsToAllocate = stockItems.filter(
            (stock) =>
                stock.decision === "PENDING" ||
                stock.decision === "PARTIALLY_ACCEPTED"
        );

        const hasAllocation = itemsToAllocate.some(
            (stock) => (allocationInputs[stock.stockItemId] ?? 0) > 0
        );

        if (!hasAllocation) {
            setErrorMessage(
                "Please enter at least one quantity to allocate."
            );
            setSuccessMessage("");
            return;
        }

        // Validate every allocation before changing inventory.
        for (const stock of itemsToAllocate) {
            const quantity = allocationInputs[stock.stockItemId] ?? 0;

            if (quantity === 0) {
                continue;
            }

            const inventory = inventoryState.find(
                (item) => item.productId === stock.productId
            );

            const currentAllocated = stock.allocatedQuantity ?? 0;

            const remaining =
                stock.requiredQuantity - currentAllocated;

            const available = inventory
                ? getAvailableStock(inventory)
                : 0;

            if (!inventory) {
                setErrorMessage(
                    "Inventory record not found for one of the products."
                );
                setSuccessMessage("");
                return;
            }

            if (
                quantity < 0 ||
                quantity > remaining ||
                quantity > available
            ) {
                const product = mockProducts.find(
                    (item) => item.productId === stock.productId
                );

                setErrorMessage(
                    `Invalid allocation quantity for ${product?.productName ?? "product"}. Maximum allowed: ${Math.min(remaining, available)}.`
                );

                setSuccessMessage("");
                return;
            }
        }

        // Update stock allocation records.
        const updatedStocks = stockItemsState.map((stock) => {
            const quantity = allocationInputs[stock.stockItemId] ?? 0;

            if (
                stock.reportItemId !== selectedReportItemId ||
                quantity <= 0 ||
                (stock.decision !== "PENDING" &&
                    stock.decision !== "PARTIALLY_ACCEPTED")
            ) {
                return stock;
            }

            const totalAllocated =
                (stock.allocatedQuantity ?? 0) + quantity;

            return {
                ...stock,
                allocatedQuantity: totalAllocated,
                decision:
                    totalAllocated >= stock.requiredQuantity
                        ? "ACCEPTED" as const
                        : "PARTIALLY_ACCEPTED" as const,
            };
        });

        // Update reserved inventory quantities.
        const updatedInventory = inventoryState.map((inventory) => {
            const addedQuantity = itemsToAllocate
                .filter(
                    (stock) => stock.productId === inventory.productId
                )
                .reduce(
                    (total, stock) =>
                        total +
                        (allocationInputs[stock.stockItemId] ?? 0),
                    0
                );

            if (addedQuantity <= 0) {
                return inventory;
            }

            return {
                ...inventory,
                quantityReserved:
                    inventory.quantityReserved + addedQuantity,
                updatedAt: new Date().toISOString(),
            };
        });

        // Update all related agency statuses.
        const updatedReportItems = reportItemsState.map((item) => ({
            ...item,
            status: calculateAgencyStatus(
                item.reportItemId,
                updatedStocks
            ),
        }));

        setStockItemsState(updatedStocks);
        setInventoryState(updatedInventory);
        setReportItemsState(updatedReportItems);
        syncAgencyOrder(selectedReportItemId, updatedStocks);

        setAllocationInputs({});
        setErrorMessage("");
        setSuccessMessage(
            "Allocation saved successfully. Inventory has been updated."
        );
    };

    // --------------------------------------------------
    // SELECT REPORT
    // --------------------------------------------------

    const handleReportSelect = (report: SapReport) => {
        setSelectedReport(report);

        const firstItem = mockSapReportItems.find(
            (item) => item.reportId === report.reportId
        );

        setSelectedReportItemId(firstItem?.reportItemId ?? "");
        setAllocationInputs({});
        setSuccessMessage("");
        setErrorMessage("");
        setActiveTab("agencies");
    };

    // --------------------------------------------------
    // SELECT AGENCY
    // --------------------------------------------------

    const handleAgencySelect = (reportItemId: string) => {
        setSelectedReportItemId(reportItemId);
        setAllocationInputs({});
        setSuccessMessage("");
        setErrorMessage("");
        setActiveTab("stocks");
    };

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------

    return (
        <div className="space-y-6">

            {/* PAGE HEADER */}

            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    SAP Requirements
                </h1>

                <p className="mt-2 text-sm text-slate-600">
                    Review agency requirements, check inventory and allocate
                    available manufacturing stock.
                </p>
            </div>

            {/* NAVIGATION */}

            <nav className="flex gap-8 overflow-x-auto border-b border-slate-200">

                <button
                    onClick={() => setActiveTab("reports")}
                    className={`shrink-0 border-b-2 px-1 py-3 text-sm font-semibold ${activeTab === "reports"
                        ? "border-[#2858a8] text-[#2858a8]"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    SAP Reports
                </button>

                <button
                    onClick={() => setActiveTab("agencies")}
                    disabled={!selectedReport}
                    className={`shrink-0 border-b-2 px-1 py-3 text-sm font-semibold disabled:opacity-40 ${activeTab === "agencies"
                        ? "border-[#2858a8] text-[#2858a8]"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    Agency Requirements
                </button>

                <button
                    onClick={() => setActiveTab("stocks")}
                    disabled={!selectedReportItem}
                    className={`shrink-0 border-b-2 px-1 py-3 text-sm font-semibold disabled:opacity-40 ${activeTab === "stocks"
                        ? "border-[#2858a8] text-[#2858a8]"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                        }`}
                >
                    Stock Review & Allocation
                </button>

            </nav>

            {/* ==========================================
                SAP REPORTS
            ========================================== */}

            {activeTab === "reports" && (
                <div className="space-y-6">

                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Upload SAP Document
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Upload an SAP Excel document received from your company.
                                </p>
                            </div>

                            <label className="cursor-pointer rounded-lg bg-[#2858a8] px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">
                                Select Excel File

                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    className="hidden"
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];

                                        if (file) {
                                            alert(`Selected file: ${file.name}`);
                                        }
                                    }}
                                />
                            </label>

                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-200 p-5">
                            <h2 className="text-lg font-semibold text-slate-900">
                                SAP Reports
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Previously uploaded SAP documents and their review status.
                            </p>
                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-sm">

                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-5 py-3">Report ID</th>
                                        <th className="px-5 py-3">File Name</th>
                                        <th className="px-5 py-3">Received Date</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {mockSapReports.map((report) => {
                                        const reportStatus =
                                            calculateReportStatus(report.reportId);

                                        return (
                                            <tr key={report.reportId}>

                                                <td className="px-5 py-4 font-medium text-slate-800">
                                                    {report.reportId}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {report.fileName}
                                                </td>

                                                <td className="px-5 py-4 text-slate-600">
                                                    {report.reportDate}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(reportStatus)}`}
                                                    >
                                                        {reportStatus.replaceAll("_", " ")}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <button
                                                        onClick={() => handleReportSelect(report)}
                                                        className="font-semibold text-[#2858a8] hover:text-blue-800"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                            {mockSapReports.length === 0 && (
                                <p className="p-5 text-sm text-slate-500">
                                    No SAP reports available.
                                </p>
                            )}

                        </div>
                    </section>

                    {selectedReport && (
                        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                            <h2 className="text-lg font-semibold text-slate-900">
                                Selected Report Details
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Report ID
                                    </p>
                                    <p className="mt-1 font-medium text-slate-900">
                                        {selectedReport.reportId}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500">
                                        File Name
                                    </p>
                                    <p className="mt-1 font-medium text-slate-900">
                                        {selectedReport.fileName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Uploaded By
                                    </p>
                                    <p className="mt-1 font-medium text-slate-900">
                                        {selectedReport.uploadedBy}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Uploaded At
                                    </p>
                                    <p className="mt-1 font-medium text-slate-900">
                                        {new Date(
                                            selectedReport.uploadedAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                            </div>

                        </section>
                    )}

                </div>
            )}

            {/* ==========================================
                AGENCY REQUIREMENTS
            ========================================== */}

            {activeTab === "agencies" && (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-5">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Agency Requirements
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Agencies included in {selectedReport?.reportId}
                        </p>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="px-5 py-3">Agency</th>
                                    <th className="px-5 py-3">Required Products</th>
                                    <th className="px-5 py-3">Due Payment</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {reportItems.map((item) => {
                                    const agency = mockAgencies.find(
                                        (a) => a.agencyId === item.agencyId
                                    );

                                    const productCount = stockItemsState.filter(
                                        (stock) =>
                                            stock.reportItemId === item.reportItemId
                                    ).length;

                                    return (
                                        <tr key={item.reportItemId}>

                                            <td className="px-5 py-4 font-medium text-slate-800">
                                                {agency?.name ?? "Unknown Agency"}
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {productCount} products
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                Rs. {item.duePayment.toLocaleString()}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(item.status)}`}
                                                >
                                                    {item.status.replaceAll("_", " ")}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() =>
                                                        handleAgencySelect(item.reportItemId)
                                                    }
                                                    className="font-semibold text-[#2858a8] hover:text-blue-800"
                                                >
                                                    Review & Allocate
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                        {reportItems.length === 0 && (
                            <p className="p-5 text-sm text-slate-500">
                                No agency requirements found for this report.
                            </p>
                        )}

                    </div>
                </section>
            )}

            {/* ==========================================
                STOCK REVIEW & ALLOCATION
            ========================================== */}

            {activeTab === "stocks" && (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-5">

                        <h2 className="text-lg font-semibold text-slate-900">
                            Stock Review & Allocation
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {selectedReportItem
                                ? `${mockAgencies.find(
                                    (a) =>
                                        a.agencyId === selectedReportItem.agencyId
                                )?.name ?? "Unknown Agency"
                                } — ${selectedReportItem.reportItemId}`
                                : "Select an agency to review stock items."}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            Check available inventory before allocating quantities.
                        </p>

                    </div>

                    {selectedReportItem && (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1050px] text-left text-sm">

                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3">Required</th>
                                        <th className="px-4 py-3">Already Allocated</th>
                                        <th className="px-4 py-3">Available Stock</th>
                                        <th className="px-4 py-3">Allocate Now</th>
                                        <th className="px-4 py-3">Remaining</th>
                                        <th className="px-4 py-3">Decision</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">

                                    {stockItems.map((stock) => {
                                        const product = mockProducts.find(
                                            (p) => p.productId === stock.productId
                                        );

                                        const inventory = inventoryState.find(
                                            (item) => item.productId === stock.productId
                                        );

                                        const available = inventory
                                            ? getAvailableStock(inventory)
                                            : 0;

                                        const allocated =
                                            stock.allocatedQuantity ?? 0;

                                        const remaining =
                                            stock.requiredQuantity - allocated;

                                        const canAllocate =
                                            stock.decision === "PENDING" ||
                                            stock.decision === "PARTIALLY_ACCEPTED";

                                        const maximum = Math.max(
                                            0,
                                            Math.min(remaining, available)
                                        );

                                        return (
                                            <tr key={stock.stockItemId}>

                                                <td className="px-4 py-4">
                                                    <p className="font-medium text-slate-800">
                                                        {product?.productName ?? "Unknown Product"}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {product?.productCode ?? "Unknown"}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-4 text-slate-700">
                                                    {stock.requiredQuantity.toLocaleString()}
                                                </td>

                                                <td className="px-4 py-4 text-slate-700">
                                                    {allocated.toLocaleString()}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span className="font-semibold text-slate-800">
                                                        {available.toLocaleString()}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">

                                                    {canAllocate ? (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={maximum}
                                                            value={
                                                                allocationInputs[
                                                                stock.stockItemId
                                                                ] ?? ""
                                                            }
                                                            disabled={maximum === 0}
                                                            onChange={(event) => {
                                                                const value =
                                                                    event.target.value === ""
                                                                        ? 0
                                                                        : Number(event.target.value);

                                                                if (
                                                                    Number.isInteger(value) &&
                                                                    value >= 0 &&
                                                                    value <= maximum
                                                                ) {
                                                                    handleAllocationChange(
                                                                        stock.stockItemId,
                                                                        value
                                                                    );
                                                                }
                                                            }}
                                                            className="w-24 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#2858a8] disabled:bg-slate-100"
                                                        />
                                                    ) : (
                                                        <span className="text-slate-400">
                                                            —
                                                        </span>
                                                    )}

                                                </td>

                                                <td className="px-4 py-4 text-slate-700">
                                                    {remaining.toLocaleString()}
                                                </td>

                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(stock.decision)}`}
                                                    >
                                                        {stock.decision.replaceAll("_", " ")}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">

                                                    {canAllocate ? (
                                                        <button
                                                            onClick={() => {
                                                                setRejectingStockId(
                                                                    stock.stockItemId
                                                                );
                                                                setRejectionReason("");
                                                            }}
                                                            className="font-semibold text-red-600 hover:text-red-800"
                                                        >
                                                            Reject
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">
                                                            Completed
                                                        </span>
                                                    )}

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                            {stockItems.length === 0 && (
                                <p className="p-5 text-sm text-slate-500">
                                    No stock items found for this agency.
                                </p>
                            )}

                        </div>
                    )}

                    {/* ALLOCATION SUMMARY */}

                    {selectedReportItem && (
                        <div className="border-t border-slate-200 p-5">

                            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Required Products
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-slate-900">
                                        {stockItems.length}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Allocated Products
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-slate-900">
                                        {
                                            stockItems.filter(
                                                (item) =>
                                                    (item.allocatedQuantity ?? 0) > 0
                                            ).length
                                        }
                                    </p>
                                </div>

                                <div className="rounded-lg bg-slate-50 p-4">
                                    <p className="text-xs text-slate-500">
                                        Agency Status
                                    </p>
                                    <p className="mt-1 text-xl font-semibold text-slate-900">
                                        {selectedReportItem.status.replaceAll("_", " ")}
                                    </p>
                                </div>

                            </div>

                            {errorMessage && (
                                <p className="mb-3 text-sm text-red-600">
                                    {errorMessage}
                                </p>
                            )}

                            {successMessage && (
                                <p className="mb-3 text-sm text-green-700">
                                    {successMessage}
                                </p>
                            )}

                            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                                <button
                                    onClick={() => setActiveTab("agencies")}
                                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Back to Agencies
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveAllocation}
                                    disabled={
                                        !stockItems.some(
                                            (item) =>
                                                (allocationInputs[item.stockItemId] ?? 0) > 0
                                        )
                                    }
                                    className="rounded-lg bg-[#2858a8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Save Allocation
                                </button>

                            </div>

                        </div>
                    )}

                    {/* REJECTION MODAL */}

                    {rejectingStockId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                                <h3 className="text-lg font-semibold text-slate-900">
                                    Reject Stock Item
                                </h3>

                                <p className="mt-2 text-sm text-slate-600">
                                    Please provide a reason for rejecting this stock item.
                                </p>

                                <textarea
                                    value={rejectionReason}
                                    onChange={(event) =>
                                        setRejectionReason(event.target.value)
                                    }
                                    placeholder="Enter rejection reason..."
                                    rows={4}
                                    className="mt-4 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-[#2858a8]"
                                />

                                <div className="mt-5 flex justify-end gap-3">

                                    <button
                                        onClick={() => {
                                            setRejectingStockId(null);
                                            setRejectionReason("");
                                        }}
                                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        disabled={!rejectionReason.trim()}
                                        onClick={() =>
                                            updateStockDecision(
                                                rejectingStockId,
                                                "REJECTED",
                                                rejectionReason.trim()
                                            )
                                        }
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Confirm Reject
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                </section>
            )}

        </div>
    );
}

export default SapRequirements;
