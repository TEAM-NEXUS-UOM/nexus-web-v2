
import { mockInventory } from "../mock/inventory";
import { mockSapReports } from "../mock/sapReports";
import { mockStockMovements } from "../mock/stockMovements";
import { mockProducts } from "../../../shared/mock/products";
import { mockAgencies } from "../../../shared/mock/agencies";
import { getAvailableStock } from "../types/inventory.types";

function Dashboard() {
    // Calculate stock summaries
    const totalAvailable = mockInventory.reduce(
        (total, item) => total + getAvailableStock(item),
        0
    );

    const totalReserved = mockInventory.reduce(
        (total, item) => total + item.quantityReserved,
        0
    );

    // Count pending SAP reports
    const pendingReports = mockSapReports.filter(
        (report) => report.status === "PENDING"
    ).length;

    // Find products with low available stock
    const lowStockAlerts = mockInventory.filter(
        (item) =>
            getAvailableStock(item) <= item.minimumStockLevel
    ).length;

    // Dashboard summary cards
    const cards = [
        {
            label: "Total Agencies",
            value: mockAgencies.length,
            description: "Registered agencies",
        },
        {
            label: "Total Products",
            value: mockProducts.length,
            description: "Manufacturing products",
        },
        {
            label: "Available Stock",
            value: totalAvailable.toLocaleString(),
            description: "Current available units",
        },
        {
            label: "Reserved Stock",
            value: totalReserved.toLocaleString(),
            description: "Stock reserved for orders",
        },
        {
            label: "Pending SAP Reports",
            value: pendingReports,
            description: "Reports awaiting review",
        },
        {
            label: "Low Stock Alerts",
            value: lowStockAlerts,
            description: "Products below minimum level",
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                    Manufacturer Dashboard
                </h1>

                <p className="mt-2 text-slate-600">
                    Overview of manufacturing operations and inventory.
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm text-slate-500">
                            {card.label}
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-slate-900">
                            {card.value}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent stock movements */}
            <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">
                    Recent Stock Movements
                </h2>

                <div className="space-y-3">
                    {mockStockMovements.slice(0, 4).map((movement) => {
                        const product = mockProducts.find(
                            (item) => item.productId === movement.productId
                        );

                        return (
                            <div
                                key={movement.movementId}
                                className="flex items-center justify-between border-b border-slate-100 pb-3"
                            >
                                <div>
                                    <p className="font-medium text-slate-800">
                                        {product?.productName ?? "Unknown Product"}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {movement.movementType.replaceAll("_", " ")}
                                    </p>
                                </div>

                                <span className="text-sm font-semibold text-slate-700">
                                    {movement.quantity.toLocaleString()} units
                                </span>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
