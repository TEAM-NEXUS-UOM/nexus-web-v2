
import { Outlet } from "react-router-dom";
import ManufacturerHeader from "./ManufacturerHeader";
import ManufacturerSideBar from "./ManufacturerSideBar";

function ManufacturerLayout() {
    return (
        <div className="flex min-h-dvh flex-col bg-slate-50 lg:flex-row">
            <ManufacturerSideBar />

            <div className="flex min-w-0 flex-1 flex-col">
                <ManufacturerHeader />

                <main className="flex-1 p-4 md:p-6 xl:p-8">
                    <div className="mx-auto w-full max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ManufacturerLayout;
