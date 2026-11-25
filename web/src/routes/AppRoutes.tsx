import { Routes, Route, Navigate } from "react-router-dom";
import { adminRoutes } from "../features/admin/routes";
import { manufacturerRoutes } from "../features/manufacturer/routes";
import { warehouseRoutes } from "../features/warehouse/routes";
import { agencyRoutes } from "../features/agency/routes";
import SignInPage from "../shared/pages/SignInPage";
import NotFound from "../shared/pages/NotFound";
import { LOGIN_PATH } from "../shared/components/auth";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={LOGIN_PATH} replace />} />
      <Route path={LOGIN_PATH} element={<SignInPage />} />
      {adminRoutes}
      {manufacturerRoutes}
      {warehouseRoutes}
      {agencyRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
