import { Routes, Route } from "react-router-dom";
import { adminRoutes } from "../features/admin/routes";
import { manufacturerRoutes } from "../features/manufacturer/routes";
import { warehouseRoutes } from "../features/warehouse/routes";
import { agencyRoutes } from "../features/agency/routes";

// Central router. Don't edit this file to add screens;
// add them to your own features/<role>/routes.tsx instead.
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>NexusFlow</h1>} />
      {adminRoutes}
      {manufacturerRoutes}
      {warehouseRoutes}
      {agencyRoutes}
    </Routes>
  );
}

export default AppRoutes;
