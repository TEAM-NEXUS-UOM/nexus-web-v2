import { Link } from "react-router-dom";
import { useAuth, getHomePath, LOGIN_PATH } from "../components/auth";

function NotFound() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Page not found</h1>
      <Link
        to={user ? getHomePath(user.role) : LOGIN_PATH}
        className="mt-4 text-sm font-medium text-primary"
      >
        Go to home page
      </Link>
    </div>
  );
}

export default NotFound;
