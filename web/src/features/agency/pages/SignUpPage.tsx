import AuthSidePanel from "../../../shared/components/auth/AuthSidePanel";
import SignUpForm from "../../../shared/components/auth/SignInForm";

function SignUpPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col lg:flex-row">
      <div className="w-full lg:w-1/2">
        <AuthSidePanel />
      </div>
      <div className="w-full lg:w-1/2">
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpPage;
