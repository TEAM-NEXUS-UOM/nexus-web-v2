import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/auth";
import { getHomePath, LOGIN_PATH } from "../components/auth";

function Unauthorized() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Access Denied</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your role ({user?.role}) can't open this page
      </p>

      {user && (
        <Link
          to={getHomePath(user.role)}
          className="mt-4 inline-block text-sm font-medium text-primary"
        >
          Go to home page
        </Link>
      )}

      <button
        type="button"
        onClick={() => {
          logout();
          navigate(LOGIN_PATH, { replace: true });
        }}
        className="mt-2 cursor-pointer text-sm text-slate-600 underline"
      >
        Sign in as someone else
      </button>
    </div>
  );
}

export default Unauthorized;
