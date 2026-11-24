import { useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/components/auth";

const titles: Record<string, string> = {
  dashboard: "Overview",
  dispatches: "Dispatches",
  inventory: "Inventory & allocation",
  trips: "Delivery trips",
  monitoring: "Live monitoring",
  fleet: "Fleet & team",
  outlets: "Retail outlets",
  orders: "Order summaries",
  settings: "Agency settings",
};

function Header() {
  const { pathname } = useLocation();
  const segment = pathname.split("/")[2] ?? "dashboard";
  const pageTitle = titles[segment] ?? "Overview";
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 md:px-6 xl:px-8">
      <p className="truncate text-xs text-slate-600">
        Agency <span className="mx-1">/</span> {pageTitle}
      </p>

      <div className="flex shrink-0 items-center gap-4 text-xs">
        <span className="hidden items-center gap-1.5 text-green-700 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
          All systems online
        </span>
        <span className="font-semibold text-slate-900">
          {user?.fullName ?? "Guest"}  • Manager
        </span>
      </div>
    </header>
  );
}

export default Header;
