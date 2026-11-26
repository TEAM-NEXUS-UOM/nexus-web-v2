
import { useState } from "react";

import {
    mockAgencyOrders,
    mockAgencyOrderItems,
} from "../mock/agencyOrders";

import {
    mockWarehouseHandovers,
    mockWarehouseHandoverItems,
} from "../mock/warehouseHandovers";

import type {
    AgencyOrder,
    AgencyOrderItem,
} from "../types/agencyOrder.types";

import type {
    WarehouseHandover as WarehouseHandoverType,
    WarehouseHandoverItem,
} from "../types/warehouseHandover.types";

function WarehouseHandover() {
    const [agencyOrdersState] =
        useState<AgencyOrder[]>(mockAgencyOrders);

    const [agencyOrderItemsState] =
        useState<AgencyOrderItem[]>(mockAgencyOrderItems);

    const [handoversState] =
        useState<WarehouseHandoverType[]>(mockWarehouseHandovers);

    const [handoverItemsState] =
        useState<WarehouseHandoverItem[]>(
            mockWarehouseHandoverItems
        );

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">
                    Warehouse Handover
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Review completed agency orders and hand them over
                    to the warehouse.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Total Agency Orders
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-slate-800">
                        {agencyOrdersState.length}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Total Handovers
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-slate-800">
                        {handoversState.length}
                    </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5">
                    <p className="text-sm text-slate-500">
                        Total Handover Items
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-slate-800">
                        {handoverItemsState.length}
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-800">
                    Agency Orders
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Agency orders generated from reviewed SAP report items.
                </p>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                                <th className="px-3 py-3">Order ID</th>
                                <th className="px-3 py-3">Report ID</th>
                                <th className="px-3 py-3">Agency ID</th>
                                <th className="px-3 py-3">Items</th>
                                <th className="px-3 py-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {agencyOrdersState.map((order) => {
                                const orderItems =
                                    agencyOrderItemsState.filter(
                                        (item) =>
                                            item.orderId === order.orderId
                                    );

                                return (
                                    <tr
                                        key={order.orderId}
                                        className="border-b border-slate-100"
                                    >
                                        <td className="px-3 py-3 font-medium text-slate-700">
                                            {order.orderId}
                                        </td>

                                        <td className="px-3 py-3 text-slate-600">
                                            {order.reportId}
                                        </td>

                                        <td className="px-3 py-3 text-slate-600">
                                            {order.agencyId}
                                        </td>

                                        <td className="px-3 py-3 text-slate-600">
                                            {orderItems.length}
                                        </td>

                                        <td className="px-3 py-3">
                                            {order.status}
                                        </td>
                                    </tr>
                                );
                            })}

                            {agencyOrdersState.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-8 text-center text-slate-500"
                                    >
                                        No agency orders available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="text-lg font-semibold text-slate-800">
                    Previous Handovers
                </h2>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                                <th className="px-3 py-3">Reference</th>
                                <th className="px-3 py-3">Report ID</th>
                                <th className="px-3 py-3">Items</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3">Sent At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {handoversState.map((handover) => {
                                const items =
                                    handoverItemsState.filter(
                                        (item) =>
                                            item.handoverId ===
                                            handover.handoverId
                                    );

                                return (
                                    <tr
                                        key={handover.handoverId}
                                        className="border-b border-slate-100"
                                    >
                                        <td className="px-3 py-3 font-medium text-slate-700">
                                            {handover.handoverReference}
                                        </td>

                                        <td className="px-3 py-3 text-slate-600">
                                            {handover.reportId}
                                        </td>

                                        <td className="px-3 py-3 text-slate-600">
                                            {items.length}
                                        </td>

                                        <td className="px-3 py-3 text-slate-600">
                                            {handover.status}
                                        </td>

                                        <td className="px-3 py-3 text-slate-600">
                                            {handover.sentAt
                                                ? new Date(
                                                    handover.sentAt
                                                ).toLocaleString()
                                                : "-"}
                                        </td>
                                    </tr>
                                );
                            })}

                            {handoversState.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-3 py-8 text-center text-slate-500"
                                    >
                                        No previous handovers.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default WarehouseHandover;
