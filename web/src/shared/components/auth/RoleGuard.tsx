
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { type Role } from "../../types/auth.types";
import { useAuth } from "./useAuth";
import Unauthorized from "../../pages/Unauthorized";

const LOGIN_PATH = "/agency/signin";

function RoleGuard({
  allow,
  loginPath = LOGIN_PATH,
}: {
  allow: Role[];
  loginPath?: string;
}) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={loginPath}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (!allow.includes(user.role)) {
    return <Unauthorized />;
  }

  return <Outlet />;
}

export default RoleGuard;
