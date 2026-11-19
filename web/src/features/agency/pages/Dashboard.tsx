const stats = [
  { label: "Dispatches to review", value: "04" },
  { label: "Active deliveries", value: "12" },
  { label: "Completed stops", value: "86 / 120" },
  { label: "Available drivers", value: "06" },
];

const trips = [
  {
    name: "Colombo North",
    meta: "TRP-0240 • 09:00 AM • 2 outlets",
    action: "Assign driver",
  },
  {
    name: "Wattala delivery",
    meta: "Draft • 11:00 AM • 4 outlets",
    action: "Continue setup",
  },
];

const card = "rounded-lg border border-slate-200 bg-white p-5";
const outlineBtn =
  "w-full cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50";

function Dashboard() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Hi, Kamal
        </h1>
        <p className="mt-1 text-xs text-slate-600 md:text-sm">
          {today} • Colombo Distribution Agency
        </p>
      </div>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={card}>
            <p className="text-xs text-slate-600">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              {s.value}
            </p>
          </div>
        ))}
      </section>

      {/* Delivery planning */}
      <section
        className={`${card} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Delivery planning
          </h2>
          <p className="text-xs text-slate-600">
            2 allocations ready • 1 trip needs a driver
          </p>
        </div>
        <button className="w-full cursor-pointer rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 sm:w-56">
          + Create delivery trip
        </button>
      </section>

      {/* Trips + incoming dispatch */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className={`${card} lg:col-span-2`}>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Trips to prepare
          </h2>

          <div className="flex flex-col gap-3">
            {trips.map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-3 rounded-lg bg-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{t.meta}</p>
                </div>
                <div className="sm:w-48">
                  <button className={outlineBtn}>{t.action}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            Incoming dispatch
          </h2>
          <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold">
            Needs review
          </span>
          <p className="mt-3 text-2xl font-bold text-slate-900">DSP-1048</p>
          <p className="mt-2 text-xs text-slate-500">
            Central Warehouse • Today, 10:30 AM
          </p>
          <p className="text-xs text-slate-500">3 products / 240 cartons</p>
          <div className="mt-4">
            <button className={outlineBtn}>Review dispatch</button>
          </div>
        </div>
      </section>

      
      <section className={card}>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900">Delivery pulse</h2>
          <button className="cursor-pointer rounded-md border border-slate-300 bg-white px-6 py-1.5 text-sm text-slate-800 hover:bg-slate-50">
            Open monitoring
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-700">
          8 on schedule <span className="mx-1.5">•</span> 3 delayed{" "}
          <span className="mx-1.5">•</span> 1 offline
        </p>
        <p className="mt-2 text-xs text-slate-500">
          TRP-0237 is running 15 minutes late. Last update 10:36 AM.
        </p>
      </section>
    </div>
  );
}

export default Dashboard;
