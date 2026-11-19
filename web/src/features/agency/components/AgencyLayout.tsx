import { Outlet } from "react-router";
import Header from "./Header";
import SideNavBar from "./SideNavBar";

function AgencyLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 lg:flex-row">
      <SideNavBar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6 xl:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AgencyLayout;
