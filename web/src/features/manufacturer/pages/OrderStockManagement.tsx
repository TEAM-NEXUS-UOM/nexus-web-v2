
import { useState } from "react";
import {
    mockAgencyOrders,
    mockAgencyOrderItems,
} from "../mock/agencyOrders";
import { mockInventory } from "../mock/inventory";
import { mockProducts } from "../../../shared/mock/products";
import { mockAgencies } from "../../../shared/mock/agencies";
import { getAvailableStock } from "../types/inventory.types";

function OrderStockManagement() {
    const [selectedOrderId, setSelectedOrderId] = useState(
        mockAgencyOrders.find((order) => order.status === "CONFIRMED")?.orderId ?? ""
    );

    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [orderItemsState, setOrderItemsState] = useState(mockAgencyOrderItems);

    const [inventoryState, setInventoryState] = useState(mockInventory);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const confirmedOrders = mockAgencyOrders.filter(
        (order) => order.status === "CONFIRMED"
    );

    const selectedOrder = confirmedOrders.find(
        (order) => order.orderId === selectedOrderId
    );

    const agency = mockAgencies.find(
        (item) => item.agencyId === selectedOrder?.agencyId
    );

    const orderItems = orderItemsState.filter(
        (item) => item.orderId === selectedOrderId
    );

    const handleAllocationChange = (itemId: string, value: number) => {
        setAllocations((previous) => ({
            ...previous,
            [itemId]: value,
        }));
    };
    const handleSaveAllocation = () => {
        const itemsToUpdate = orderItems.filter(
            (item) => (allocations[item.orderItemId] ?? 0) > 0
        );

        if (itemsToUpdate.length === 0) {
            setErrorMessage("Please enter at least one quantity to allocate.");
            setSuccessMessage("");
            return;
        }

        // Validate all entered quantities before saving
        for (const item of itemsToUpdate) {
            const quantity = allocations[item.orderItemId] ?? 0;

            const inventory = inventoryState.find(
                (stock) => stock.productId === item.productId
            );

            const remaining = item.requestedQty - item.allocatedQty;
            const available = inventory ? getAvailableStock(inventory) : 0;

            if (quantity > remaining || quantity > available) {
                setErrorMessage(
                    `Invalid allocation quantity for ${item.orderItemId}.`
                );
                setSuccessMessage("");
                return;
            }
        }

        // Update allocated quantities
        const updatedOrderItems = orderItemsState.map((item) => {
            const quantity = allocations[item.orderItemId] ?? 0;

            return quantity > 0
                ? { ...item, allocatedQty: item.allocatedQty + quantity }
                : item;
        });

        // Update reserved inventory quantities
        const updatedInventory = inventoryState.map((stock) => {
            const addedQuantity = itemsToUpdate
                .filter((item) => item.productId === stock.productId)
                .reduce(
                    (total, item) => total + (allocations[item.orderItemId] ?? 0),
                    0
                );

            return addedQuantity > 0
                ? {
                    ...stock,
                    quantityReserved: stock.quantityReserved + addedQuantity,
                    updatedAt: new Date().toISOString(),
                }
                : stock;
        });

        setOrderItemsState(updatedOrderItems);
        setInventoryState(updatedInventory);

        setAllocations({});
        setErrorMessage("");
        setSuccessMessage("Stock allocation saved successfully.");
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Order Stock Management
                </h1>
                <p className="mt-2 text-slate-600">
                    Manage and allocate available manufacturing stock for agency orders.
                </p>
            </div>

            <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    Select Agency Order
                </h2>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirmed Orders
                </label>

                <select
                    value={selectedOrderId}
                    onChange={(event) => {
                        setSelectedOrderId(event.target.value);
                        setAllocations({});
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 sm:max-w-md"
                >
                    {confirmedOrders.map((order) => (
                        <option key={order.orderId} value={order.orderId}>
                            {order.orderId}
                        </option>
                    ))}
                </select>

                {selectedOrder && (
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-slate-500">Order ID</p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {selectedOrder.orderId}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Agency</p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {agency?.name ?? "Unknown Agency"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">SAP Report</p>
                            <p className="mt-1 font-semibold text-slate-800">
                                {selectedOrder.reportId}
                            </p>
                        </div>
                    </div>
                )}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Order Products
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Review requested quantities and available stock.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                                <th className="px-3 py-3 font-medium">Product</th>
                                <th className="px-3 py-3 font-medium">Requested</th>
                                <th className="px-3 py-3 font-medium">Already Allocated</th>
                                <th className="px-3 py-3 font-medium">Available Stock</th>
                                <th className="px-3 py-3 font-medium">Allocate Now</th>
                                <th className="px-3 py-3 font-medium">Remaining</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orderItems.map((item) => {
                                const product = mockProducts.find(
                                    (product) => product.productId === item.productId
                                );

                                const inventory = inventoryState.find(
                                    (stock) => stock.productId === item.productId
                                );

                                const available = inventory
                                    ? getAvailableStock(inventory)
                                    : 0;

                                const remaining = item.requestedQty - item.allocatedQty;

                                const allocation = allocations[item.orderItemId] ?? 0;

                                return (
                                    <tr
                                        key={item.orderItemId}
                                        className="border-b border-slate-100"
                                    >
                                        <td className="px-3 py-4">
                                            <p className="font-medium text-slate-800">
                                                {product?.productName ?? "Unknown Product"}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {product?.productCode}
                                            </p>
                                        </td>

                                        <td className="px-3 py-4 text-slate-700">
                                            {item.requestedQty}
                                        </td>

                                        <td className="px-3 py-4 text-slate-700">
                                            {item.allocatedQty}
                                        </td>

                                        <td className="px-3 py-4 font-medium text-slate-700">
                                            {available}
                                        </td>

                                        <td className="px-3 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                max={Math.min(remaining, available)}
                                                value={allocation}
                                                disabled={remaining === 0 || available === 0}
                                                onChange={(event) => {
                                                    const value = Number(event.target.value);
                                                    const maximum = Math.min(remaining, available);

                                                    if (value >= 0 && value <= maximum) {
                                                        handleAllocationChange(item.orderItemId, value);
                                                    }
                                                }}
                                                className="w-24 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-slate-100"
                                            />
                                        </td>

                                        <td className="px-3 py-4 font-medium text-slate-700">
                                            {remaining}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex flex-col items-end gap-3">
                    {errorMessage && (
                        <p className="text-sm text-red-600">
                            {errorMessage}
                        </p>
                    )}

                    {successMessage && (
                        <p className="text-sm text-green-600">
                            {successMessage}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleSaveAllocation}
                        disabled={!Object.values(allocations).some((quantity) => quantity > 0)}
                        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Save Allocation
                    </button>
                </div>
            </section>
        </div>
    );
}

export default OrderStockManagement;
