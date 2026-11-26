import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/components/auth";
import { getDeliveryTripList } from "../../../shared/services/tripService";
import { type TripStatus } from "../../../shared/types/trip.types";
import { type TripListItem } from "../../../shared/types/tripPlanning.types";
import { formatDateTime, plural } from "../utils/format";

const card = "rounded-lg border border-slate-200 bg-white p-5";
const pill = "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

type TripTab = "ONGOING" | "SCHEDULED" | "COMPLETED";

const tabs: { tab: TripTab; text: string; statuses: TripStatus[]; empty: string }[] = [
  { tab: "ONGOING", text: "Ongoing", statuses: ["IN_PROGRESS"], empty: "No trips are on the road right now." },
  { tab: "SCHEDULED", text: "Scheduled", statuses: ["DRAFT", "PLANNED", "ASSIGNED"], empty: "No trips are scheduled." },
  { tab: "COMPLETED", text: "Completed", statuses: ["COMPLETED"], empty: "No completed trips yet." },
];

const statusPill: Record<TripStatus, { text: string; className: string }> = {
  DRAFT: { text: "Draft", className: "bg-slate-200 text-slate-700" },
  PLANNED: { text: "Planned", className: "bg-amber-100 text-amber-900" },
  ASSIGNED: { text: "Assigned", className: "bg-sky-100 text-sky-800" },
  IN_PROGRESS: { text: "In progress", className: "bg-primary/10 text-primary" },
  COMPLETED: { text: "Completed", className: "bg-green-100 text-green-800" },
  CANCELLED: { text: "Cancelled", className: "bg-red-100 text-red-700" },
};

const byTime = (a: string, b: string) =>
  new Date(a).getTime() - new Date(b).getTime();

function missingResources(item: TripListItem): string[] {
  const missing: string[] = [];
  if (!item.vehicle) missing.push("vehicle");
  if (!item.driver) missing.push("driver");
  if (!item.agent) missing.push("agent");
  return missing;
}

function TripRow({ item, tab }: { item: TripListItem; tab: TripTab }) {
  const { trip } = item;
  const status = statusPill[trip.status];
  const missing = missingResources(item);
  const progress =
    item.stopsTotal > 0
      ? Math.round((item.stopsDelivered / item.stopsTotal) * 100)
      : 0;

  const resources = [
    { title: "Vehicle", value: item.vehicle?.regNo },
    { title: "Driver", value: item.driver?.fullName },
    { title: "Agent", value: item.agent?.fullname },
  ];

  return (
    <li className="flex flex-col gap-4 rounded-lg bg-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 lg:w-1/3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">
            {trip.tripName}
          </p>
          <span className={`${pill} ${status.className}`}>{status.text}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          {trip.tripCode} • {formatDateTime(trip.scheduledAt)} •{" "}
          {plural(item.outletCount, "outlet")}
        </p>
      </div>

      <dl className="grid grid-cols-3 gap-3 text-xs lg:w-1/3">
        {resources.map((r) => (
          <div key={r.title} className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {r.title}
            </dt>
            <dd
              className={`truncate ${r.value ? "font-medium text-slate-900" : "text-slate-400"}`}
            >
              {r.value ?? "Not assigned"}
            </dd>
          </div>
        ))}
      </dl>

      <div className="text-xs lg:w-56">
        {tab === "SCHEDULED" ? (
          missing.length > 0 ? (
            <p className="font-medium text-amber-800">
              Needs {missing.join(", ")}
            </p>
          ) : (
            <p className="font-medium text-green-700">Ready to depart</p>
          )
        ) : (
          <>
            <div className="flex justify-between text-slate-600">
              <span>
                {item.stopsDelivered} / {item.stopsTotal} stops delivered
              </span>
              {item.stopsFailed > 0 && (
                <span className="font-medium text-red-600">
                  {item.stopsFailed} failed
                </span>
              )}
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${tab === "COMPLETED" ? "bg-green-600" : "bg-primary"}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            {tab === "COMPLETED" && trip.completedAt && (
              <p className="mt-1.5 text-slate-500">
                Completed {formatDateTime(trip.completedAt)}
              </p>
            )}
          </>
        )}
      </div>
    </li>
  );
}

function Trips() {
  const { user } = useAuth();
  const agencyId = user?.agencyId ?? "";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TripTab>("ONGOING");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["agencyTrips", agencyId],
    queryFn: () => getDeliveryTripList(agencyId),
    enabled: !!agencyId,
  });

  const itemsFor = (tab: TripTab) => {
    const { statuses } = tabs.find((t) => t.tab === tab)!;
    const list = items.filter((i) => statuses.includes(i.trip.status));
    // Completed: newest first. Others: soonest first.
    return tab === "COMPLETED"
      ? list.sort((a, b) =>
          byTime(b.trip.completedAt ?? b.trip.scheduledAt, a.trip.completedAt ?? a.trip.scheduledAt),
        )
      : list.sort((a, b) => byTime(a.trip.scheduledAt, b.trip.scheduledAt));
  };

  const current = tabs.find((t) => t.tab === activeTab)!;
  const visible = itemsFor(activeTab);

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Delivery trips
          </h1>
          <p className="mt-1 text-xs text-slate-600 md:text-sm">
            Follow trips on the road, check scheduled trips and review completed
            deliveries.
          </p>
        </div>
        <button
          onClick={() => navigate("/agency/trips/new")}
          className="w-full cursor-pointer rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 sm:w-56"
        >
          + Create delivery trip
        </button>
      </div>

      <section className={card}>
        <div role="tablist" className="mb-4 flex flex-wrap gap-2">
          {tabs.map(({ tab, text }) => {
            const active = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer rounded-md px-4 py-2 text-sm ${
                  active
                    ? "bg-primary font-semibold text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {text}{" "}
                <span className={active ? "text-white/80" : "text-slate-400"}>
                  {isLoading ? "–" : itemsFor(tab).length}
                </span>
              </button>
            );
          })}
        </div>

        {isLoading && <p className="text-xs text-slate-500">Loading trips…</p>}
        {!isLoading && visible.length === 0 && (
          <p className="text-xs text-slate-500">{current.empty}</p>
        )}

        <ul className="flex flex-col gap-3">
          {visible.map((item) => (
            <TripRow key={item.trip.tripId} item={item} tab={activeTab} />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Trips;
