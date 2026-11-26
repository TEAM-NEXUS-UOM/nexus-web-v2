
import { Route } from "react-router-dom";

import ManufacturerLayout from "./components/ManufacturerLayout";

import Dashboard from "./pages/Dashboard";
import SapRequirements from "./pages/SapRequirements";
import OrderStockManagement from "./pages/OrderStockManagement";
import WarehouseHandover from "./pages/WarehouseHandover";
import ComingSoon from "./pages/ComingSoon";

import { RoleGuard } from "../../shared/components/auth";

export const manufacturerRoutes = (
    <>
        {/* Protected Manufacturer Routes */}
        <Route
            element={
                <RoleGuard allow={["MANUFACTURING_ADMIN"]} />
            }
        >
            <Route
                path="/manufacturer"
                element={<ManufacturerLayout />}
            >
                <Route index element={<Dashboard />} />

                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="sap-requirements"
                    element={<SapRequirements />}
                />

                <Route
                    path="order-stock-management"
                    element={<OrderStockManagement />}
                />

                <Route
                    path="warehouse-handover"
                    element={<WarehouseHandover />}
                />

                <Route path="*" element={<ComingSoon />} />
            </Route>
        </Route>
    </>
);

