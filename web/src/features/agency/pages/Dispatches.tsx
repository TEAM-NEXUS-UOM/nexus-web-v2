import { useState } from "react";

type Status =
  | "Pending review"
  | "Accepted"
  | "Received"
  | "Reschedule requested";

type Dispatch = {
  id: string;
  warehouse: string;
  arrival: string;
  products: string;
  status: Status;
};

const dispatches: Dispatch[] = [
  {
    id: "DSP-1048",
    warehouse: "Central WH",
    arrival: "18 Oct, 10:30 AM",
    products: "3 products / 240",
    status: "Pending review",
  },
  {
    id: "DSP-1047",
    warehouse: "Central WH",
    arrival: "18 Oct, 12:00 PM",
    products: "5 products / 320",
    status: "Pending review",
  },
  {
    id: "DSP-1046",
    warehouse: "Kelaniya WH",
    arrival: "18 Oct, 09:00 AM",
    products: "4 products / 180",
    status: "Accepted",
  },
  {
    id: "DSP-1045",
    warehouse: "Central WH",
    arrival: "17 Oct, 02:00 PM",
    products: "6 products / 410",
    status: "Received",
  },
  {
    id: "DSP-1044",
    warehouse: "Kelaniya WH",
    arrival: "17 Oct, 11:30 AM",
    products: "2 products / 150",
    status: "Reschedule requested",
  },
];

type Filter = "all" | "pending" | "accepted";

const filters: { key: Filter; label: string; count: number; style: string }[] =
  [
    {
      key: "all",
      label: "All dispatches",
      count: 18,
      style: "",
    },
    {
      key: "pending",
      label: "Pending review",
      count: 4,
      style: "",
    },
    {
      key: "accepted",
      label: "Accepted",
      count: 12,
      style: "",
    },
  ];

const TOTAL = 18;

function Dispatches() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = dispatches.filter((d) => {
    if (filter === "pending") return d.status === "Pending review";
    if (filter === "accepted") return d.status === "Accepted";
    return true;
  });

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Dispatches
        </h1>
        <p className="mt-1 text-xs text-slate-600 md:text-sm">
          Review incoming shipments from the warehouse and plan the next step.
        </p>
      </div>

     
      <section className="flex flex-col gap-3 rounded-lg bg-white p-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold ${f.style} ${
                filter === f.key ? "ring-2 ring-primary/40" : ""
              }`}
            >
              {f.label} <span className="ml-1">{f.count}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="w-full cursor-pointer rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:opacity-90 sm:w-auto"
        >
          Review DSP-1048
        </button>
      </section>

      
      <section className="rounded-lg border border-slate-200 bg-white p-4 md:p-5">
        <h2 className="mb-4 text-lg font-bold text-slate-900">
          Incoming dispatches
        </h2>

       
        <div className="hidden grid-cols-4 gap-4 rounded-md bg-slate-100 px-4 py-2.5 text-[11px] font-medium text-slate-600 md:grid">
          <span>Dispatch / warehouse</span>
          <span>Expected arrival</span>
          <span>Products / cartons</span>
          <span>Status</span>
        </div>

       
        <div className="mt-2 flex flex-col gap-2">
          {visible.map((d) => (
            <div
              key={d.id}
              className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-md border border-slate-200 px-4 py-3 text-sm md:grid-cols-4 md:items-center md:gap-y-0"
            >
              <p className="col-span-2 font-semibold text-slate-900 md:col-span-1">
                {d.id} • {d.warehouse}
              </p>

              <div>
                <p className="text-[11px] text-slate-500 md:hidden">
                  Expected arrival
                </p>
                <p className="text-xs text-slate-800 md:text-sm">{d.arrival}</p>
              </div>

              <div>
                <p className="text-[11px] text-slate-500 md:hidden">
                  Products / cartons
                </p>
                <p className="text-xs text-slate-800 md:text-sm">
                  {d.products}
                </p>
              </div>

              <div className="col-span-2 md:col-span-1">
                <p className="text-[11px] text-slate-500 md:hidden">Status</p>
                <p className="text-xs text-primary md:text-sm">{d.status}</p>
              </div>
            </div>
          ))}

          {visible.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              No dispatches in this view.
            </p>
          )}
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Showing {visible.length} of {TOTAL} dispatches
        </p>
      </section>
    </div>
  );
}

export default Dispatches;
