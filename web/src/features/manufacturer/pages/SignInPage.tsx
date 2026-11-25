
import ManufacturerAuthSidePanel from "../components/auth/ManufacturerAuthSidePanel";
import SignInForm from "../../agency/components/auth/SignInForm";

function SignInPage() {
    return (
        <div className="flex min-h-dvh w-full flex-col lg:flex-row">
            <div className="w-full lg:w-1/2">
                <ManufacturerAuthSidePanel />
            </div>

            <div className="w-full lg:w-1/2">
                <SignInForm />
            </div>
        </div>
    );
}

export default SignInPage;
