import { Link } from "react-router-dom";
import { useAuth } from "../components/auth";
import { getHomePath } from "../components/auth";

function Unauthorized() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-6">
      <div className="text-xl font-bold text-slate-900"></div>
      <h1 className="">Access Denied</h1>
      <p className="mt-2 text-sm text-slate-600">
        {" "}
        Your role ({user?.role}) can't open this page
      </p>

      {user && (
        <Link
          to={getHomePath(user.role)}
          className="mt-4 inline-block text-sm font-medium text-primary"
        >
          Got to home page
        </Link>
      )}
    </div>
  );
}

export default Unauthorized;
