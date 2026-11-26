import { useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/components/auth";

const titles: Record<string, string> = {
    dashboard: "Overview",
    "sap-requirements": "SAP Requirements",
    "upcoming-orders": "Upcoming Orders",
    stocks: "Manufacturing Stocks",
    "order-stock-management": "Order Stock Management",
    "warehouse-handover": "Warehouse Handover",
    schedules: "Shipment Schedules",
    agencies: "Agency Management",
    reports: "Reports & History",
    settings: "Settings",
};

const roleNames: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    MANUFACTURING_ADMIN: "Manufacturer Admin",
    AGENCY_MANAGER: "Agency Manager",
    WAREHOUSE_MANAGER: "Warehouse Manager",
    WAREHOUSE_SUPERVISOR: "Warehouse Supervisor",
};

function ManufacturerHeader() {
    const { pathname } = useLocation();
    const segment = pathname.split("/")[2] ?? "dashboard";
    const pageTitle = titles[segment] ?? "Overview";

    const { user } = useAuth();

    const roleName = user ? roleNames[user.role] ?? user.role : "";

    return (
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 md:px-6 xl:px-8">
            <p className="truncate text-xs text-slate-600">
                Manufacturer <span className="mx-1">/</span> {pageTitle}
            </p>

            <div className="flex shrink-0 items-center gap-4 text-xs">
                <span className="hidden items-center gap-1.5 text-green-700 sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                    All systems online
                </span>

                <span className="font-semibold text-slate-900">
                    {user?.fullName ?? "Guest"}
                    {roleName && ` • ${roleName}`}
                </span>
            </div>
        </header>
    );
}

export default ManufacturerHeader;