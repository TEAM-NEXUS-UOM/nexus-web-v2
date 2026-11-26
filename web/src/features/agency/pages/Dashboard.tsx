import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAgencyById } from "../../../shared/services/agencyService";
import { getItemsByDispatchId } from "../../../shared/services/dispatchAllocationService";
import { getAgencyDashboardSummary } from "../../../shared/services/agencyDashboardService";
import { useAuth } from "../../../shared/components/auth";
import type { TripNextAction } from "../../../shared/types/agencyDashboard.types";
import type { TripStatus } from "../../../shared/types/trip.types";

const card = "rounded-lg border border-slate-200 bg-white p-5";
const outlineBtn =
  "w-full cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50";

const actionLabel: Record<TripNextAction, string> = {
  ASSIGN_DRIVER: "Assign driver",
  ASSIGN_VEHICLE: "Assign vehicle",
  CONTINUE_SETUP: "Continue setup",
  READY: "View trip",
};

const statusLabel: Partial<Record<TripStatus, string>> = {
  DRAFT: "Draft",
  PLANNED: "Planned",
  ASSIGNED: "Assigned",
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const agencyId = user?.agencyId ?? "";
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { data: agency, isLoading: agencyLoading } = useQuery({
    queryKey: ["agency", agencyId],
    queryFn: () => getAgencyById(agencyId),
    enabled: !!agencyId,
  });

  const { data: summary, isLoading } = useQuery({
    queryKey: ["agencyDashboard", agencyId],
    queryFn: () => getAgencyDashboardSummary(agencyId),
    enabled: !!agencyId,
  });

  const incoming = summary?.incomingDispatch ?? null;
  const { data: incomingItems } = useQuery({
    queryKey: ["dispatchItems", incoming?.dispatchAllocationId],
    queryFn: () => getItemsByDispatchId(incoming!.dispatchAllocationId),
    enabled: !!incoming,
  });
  const incomingQty =
    incomingItems?.reduce((sum, i) => sum + i.allocatedQty, 0) ?? 0;

  const stats = [
    { label: "Dispatches to review", value: summary?.dispatchesToReview },
    { label: "Active deliveries", value: summary?.activeDeliveries },
    {
      label: "Completed stops",
      value: summary
        ? `${summary.stops.completed} / ${summary.stops.total}`
        : undefined,
    },
    { label: "Available drivers", value: summary?.availableDrivers },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Hello, {user?.fullName.split(" ")[0] ?? "there"} !
        </h1>
        <p className="mt-1 text-xs text-slate-600 md:text-sm">
          {today} • {agencyLoading ? "Loading" : agency?.name}
        </p>
      </div>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={card}>
            <p className="text-xs text-slate-600">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              {isLoading ? "–" : (s.value ?? 0)}
            </p>
          </div>
        ))}
      </section>

      <section
        className={`${card} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Delivery planning
          </h2>
          <p className="text-xs text-slate-600">
            {plural(summary?.allocationsReady ?? 0, "allocation")} ready •{" "}
            {plural(summary?.tripsNeedingDriver ?? 0, "trip")} need
            {summary?.tripsNeedingDriver === 1 ? "s" : ""} a driver
          </p>
        </div>
        <button
          onClick={() => navigate("/agency/trips/new")}
          className="w-full cursor-pointer rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 sm:w-56"
        >
          + Create delivery trip
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className={`${card} lg:col-span-2`}>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Trips to prepare
          </h2>

          <div className="flex flex-col gap-3">
            {summary?.tripsToPrepare.length === 0 && (
              <p className="text-xs text-slate-500">
                No trips waiting for setup.
              </p>
            )}
            {summary?.tripsToPrepare.map(({ trip, outletCount, nextAction }) => (
              <div
                key={trip.tripId}
                className="flex flex-col gap-3 rounded-lg bg-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {trip.tripName}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {trip.tripCode} • {statusLabel[trip.status]} •{" "}
                    {formatDateTime(trip.scheduledAt)} •{" "}
                    {plural(outletCount, "outlet")}
                  </p>
                </div>
                <div className="sm:w-48">
                  <button className={outlineBtn}>
                    {actionLabel[nextAction]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <h2 className="mb-3 text-lg font-bold text-slate-900">
            Incoming dispatch
          </h2>
          {incoming ? (
            <>
              <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold">
                Needs review
              </span>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                DSP-{incoming.dispatchAllocationId.padStart(4, "0")}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Bay {incoming.loadingBay} •{" "}
                {formatDateTime(incoming.scheduledAt)}
              </p>
              <p className="text-xs text-slate-500">
                {plural(incomingItems?.length ?? 0, "item")} / {incomingQty}{" "}
                units
              </p>
              <div className="mt-4">
                <button className={outlineBtn}>Review dispatch</button>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500">
              No dispatches waiting for review.
            </p>
          )}
        </div>
      </section>

      <section className={card}>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-slate-900">Delivery Status</h2>
          <button className="cursor-pointer rounded-md border border-slate-300 bg-white px-6 py-1.5 text-sm text-slate-800 hover:bg-slate-50">
            Open monitoring
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-700">
          {summary?.tracking.onSchedule ?? 0} on schedule
          <span className="mx-1.5">•</span>
          {summary?.tracking.delayed ?? 0} delayed
          <span className="mx-1.5">•</span>
          {summary?.tracking.offline ?? 0} offline
        </p>
        {summary?.latestAlert && (
          <p className="mt-2 text-xs text-slate-500">
            {summary.latestAlert.message} Last update{" "}
            {formatTime(summary.latestAlert.createdAt)}.
          </p>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
