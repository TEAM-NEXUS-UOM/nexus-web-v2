import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/components/auth";

const navItems = [
  { label: "Overview", to: "/agency/dashboard" },
  { label: "Dispatches", to: "/agency/dispatches" },
  { label: "Inventory & allocation", to: "/agency/inventory" },
  { label: "Delivery trips", to: "/agency/trips" },
  { label: "Live monitoring", to: "/agency/monitoring" },
  { label: "Fleet & team", to: "/agency/fleet" },
  { label: "Retail outlets", to: "/agency/outlets" },
  { label: "Order summaries", to: "/agency/orders" },
  { label: "Agency settings", to: "/agency/settings" },
];

const linkBase =
  "whitespace-nowrap rounded-lg px-4 py-3 text-sm transition-colors lg:py-2.5";

function SideNavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <h2 className="text-lg font-bold text-slate-900">Agency Portal</h2>
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="agency-sidebar"
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-lg p-2 text-slate-700 hover:bg-slate-100"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="agency-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto border-r border-slate-200 bg-white px-4 py-6 shadow-xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none xl:w-72`}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 lg:text-xl">
            Agency Portal
          </h2>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Agency workspace
          </p>
          <div className="rounded-lg bg-slate-100 px-3 py-3">
            <p className="text-sm font-semibold text-slate-900">
              Colombo Distribution
            </p>
            <p className="text-xs text-slate-500">Western Province</p>
          </div>
        </div>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Operations
        </p>

        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "bg-blue-50 font-semibold text-primary"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
              navigate("/agency/signin", { replace: true });
            }}
            className={`${linkBase} cursor-pointer text-left text-slate-600 hover:bg-slate-100`}
          >
            Sign out
          </button>
        </nav>
      </aside>
    </>
  );
}

export default SideNavBar;
