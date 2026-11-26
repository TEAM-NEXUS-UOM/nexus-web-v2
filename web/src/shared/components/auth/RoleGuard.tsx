import { Navigate, useLocation, Outlet } from "react-router-dom";
import { type Role } from "../../types/auth.types";
import { useAuth } from "./useAuth";
import Unauthorized from "../../pages/Unauthorized";
import { LOGIN_PATH } from "../../services/authService";

function RoleGuard({ allow }: { allow: Role[] }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate to={LOGIN_PATH} replace state={{ from: location.pathname }} />
    );
  }

  if (!allow.includes(user.role)) {
    return <Unauthorized />;
  }

  return <Outlet />;
}

export default RoleGuard;
