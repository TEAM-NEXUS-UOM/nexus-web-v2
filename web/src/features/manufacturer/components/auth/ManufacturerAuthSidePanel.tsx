
import logInImage from "../../../agency/assests/logInImage2.png";

function ManufacturerAuthSidePanel() {
    return (
        <div className="flex w-full overflow-hidden bg-blue-50 transition-all duration-300 ease-in-out lg:h-dvh">
            <div className="flex w-full flex-col gap-3 px-6 py-6 sm:px-10 md:px-14 lg:gap-4 lg:px-20 lg:py-8 xl:px-24">
                <h3 className="text-2xl font-bold text-slate-950 lg:text-3xl">
                    Manufacturer Portal
                </h3>

                <p className="text-xs font-medium text-primary lg:text-sm">
                    MANUFACTURING, CONNECTED
                </p>

                <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl lg:text-4xl xl:text-5xl">
                    <span className="block">Manage production,</span>
                    <span className="block">with confidence.</span>
                </h1>

                <p className="max-w-xl text-sm font-medium text-slate-800 xl:text-base">
                    Manage SAP requirements, manufacturing stocks and shipment schedules
                    through one connected platform.
                </p>

                <div className="hidden h-56 items-center justify-center sm:flex md:h-72 lg:flex-1">
                    <img
                        src={logInImage}
                        alt="Manufacturer operations"
                        className="max-h-full max-w-full object-contain"
                    />
                </div>

                <div className="hidden flex-col gap-1 lg:flex">
                    <p className="text-xl font-bold text-primary xl:text-2xl">
                        Better manufacturing. Every day.
                    </p>
                    <p className="text-sm font-medium text-primary xl:text-base">
                        Your requirements, stocks and shipments - working together.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ManufacturerAuthSidePanel;
