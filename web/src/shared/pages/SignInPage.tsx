import { Navigate } from "react-router-dom";
import AuthSidePanel from "../components/auth/AuthSidePanel";
import SignInForm from "../components/auth/SignInForm";
import { useAuth, getHomePath } from "../components/auth";

function SignInPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      <div className="w-full lg:w-1/2">
        <AuthSidePanel />
      </div>
      <div className="w-full lg:w-1/2">
        <SignInForm />
      </div>
    </div>
  );
}

export default SignInPage;
