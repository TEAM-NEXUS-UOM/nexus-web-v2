import AuthSidePanel from "../components/auth/AuthSidePanel";
import SignInForm from "../components/auth/SignInForm";

function SignInPage() {
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
