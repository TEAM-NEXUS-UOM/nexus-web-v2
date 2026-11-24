import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAuth,
  getMockUsers,
  getHomePath,
} from "../../../../shared/components/auth";

function SignInForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>("");

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-4 px-6 py-10 sm:px-8 lg:h-dvh lg:py-0 xl:max-w-lg">
        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-slate-700">Sign in to your agency workspace</p>

        <form
          className="flex flex-col space-y-4 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            // Mock auth: match by email only, no password check
            const found = getMockUsers().find(
              (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
            );
            if (!found) {
              setError("No user found with that email");
              return;
            }
            setError("");
            login(found);
            navigate(getHomePath(found.role), { replace: true });
          }}
        >
          <label htmlFor="workEmail" className="text-sm text-slate-700">
            Work Email
          </label>
          <input
            id="workEmail"
            type="email"
            autoComplete="email"
            placeholder="manager@nexus.lk"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="text-sm text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password here"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <section className="flex flex-wrap items-center justify-between gap-2 px-1 py-2">
            <label
              htmlFor="remember"
              className="flex cursor-pointer items-center gap-2"
            >
              <input id="remember" type="checkbox" className="h-4 w-4" />
              <span className="text-sm text-slate-700">Remember Me</span>
            </label>

            <p className="cursor-pointer text-xs font-bold text-primary">
              Forgot password?
            </p>
          </section>
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-primary py-2.5 text-lg font-medium text-white"
          >
            Sign In
          </button>
        </form>

        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-center text-xs font-light text-slate-700">
            Protected access for authorized agency staff
          </p>

          <section className="flex gap-2">
            <p className="text-xs font-light text-slate-800">
              Don't have an account?
            </p>
            <p className="cursor-pointer text-xs font-semibold text-primary">
              Sign Up
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
