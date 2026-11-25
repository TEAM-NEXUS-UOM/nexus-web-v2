import { Route, Navigate } from "react-router-dom";
import AgencyLayout from "./components/AgencyLayout";
import Dashboard from "./pages/Dashboard";
import Dispatches from "./pages/Dispatches";
import ComingSoon from "./pages/ComingSoon";
import SignUpPage from "./pages/SignUpPage";
import { RoleGuard, LOGIN_PATH } from "../../shared/components/auth";

export const agencyRoutes = (
  <>
    <Route
      path="/agency/signin"
      element={<Navigate to={LOGIN_PATH} replace />}
    />
    <Route path="/agency/signup" element={<SignUpPage />} />

    <Route path="/agency" element={<RoleGuard allow={["AGENCY_MANAGER"]} />}>
      <Route element={<AgencyLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dispatches" element={<Dispatches />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Route>
  </>
);
