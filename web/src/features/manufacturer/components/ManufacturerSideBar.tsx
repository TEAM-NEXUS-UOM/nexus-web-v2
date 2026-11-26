
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/components/auth";

const navItems = [
    { label: "Overview", to: "/manufacturer", end: true },
    { label: "SAP Requirements", to: "/manufacturer/sap-requirements" },
    { label: "Upcoming Orders", to: "/manufacturer/upcoming-orders" },
    { label: "Manufacturing Stocks", to: "/manufacturer/stocks" },
    { label: "Order Stock Management", to: "/manufacturer/order-stock-management" },
    { label: "Agency Management", to: "/manufacturer/agencies" },
    { label: "Reports & History", to: "/manufacturer/reports" },
    { label: "Settings", to: "/manufacturer/settings" },
];

const linkBase =
    "whitespace-nowrap rounded-lg px-4 py-3 text-sm transition-colors lg:py-2.5";

function ManufacturerSideBar() {
    const [open, setOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/signin", { replace: true });
    };

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
                <h2 className="text-lg font-bold text-slate-900">
                    Manufacturer Portal
                </h2>

                <button
                    type="button"
                    aria-label="Open navigation menu"
                    onClick={() => setOpen(true)}
                    className="cursor-pointer rounded-lg p-2 text-slate-700 hover:bg-slate-100"
                >
                    ☰
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
                className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-slate-200 bg-white px-4 py-6 shadow-xl transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"
                    } lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none xl:w-72`}
            >
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 lg:text-xl">
                        Manufacturer Portal
                    </h2>
                </div>

                <div className="mb-6">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Manufacturer workspace
                    </p>

                    <div className="rounded-lg bg-slate-100 px-3 py-3">
                        <p className="text-sm font-semibold text-slate-900">
                            Manufacturer Administration
                        </p>
                        <p className="text-xs text-slate-500">
                            Management workspace
                        </p>
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
                            end={item.end}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `${linkBase} ${isActive
                                    ? "bg-blue-50 font-semibold text-primary"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout button */}
                <div className="mt-auto border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-600"
                    >
                        <span className="text-lg">↪</span>
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

export default ManufacturerSideBar;
