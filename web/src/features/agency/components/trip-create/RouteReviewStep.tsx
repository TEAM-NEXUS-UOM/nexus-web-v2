import { type Dispatch } from "react";
import { type Agency } from "../../../../shared/types/agency";
import { type Id } from "../../../../shared/types/common";
import { type AllocationDetail } from "../../../../shared/types/tripPlanning.types";
import { formatClock, formatUnits } from "../../utils/format";
import RouteMapPlaceholder from "./RouteMapPlaceholder";
import {
  type ChosenResources,
  type TripCreateAction,
  type TripDetails,
} from "./tripCreateState";
import { card, label, linkBtn, outlineBtn, primaryBtn } from "./ui";

const MINUTES_PER_STOP = 20; // placeholder ETA, same rule as tripService

interface Props {
  details: TripDetails;
  dispatch: Dispatch<TripCreateAction>;
  agency: Agency | undefined;
  orderedStops: AllocationDetail[];
  plannedIds: Id[];
  chosen: ChosenResources;
  onConfirm: () => void;
  confirming: boolean;
  error: string | null;
}

const arrowBtn =
  "flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-slate-300 bg-white text-xs text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30";

function RouteReviewStep({
  details,
  dispatch,
  agency,
  orderedStops,
  plannedIds,
  chosen,
  onConfirm,
  confirming,
  error,
}: Props) {
  const orderedIds = orderedStops.map((s) => s.allocation.outletAllocationId);
  const modified = orderedIds.join() !== plannedIds.join();

  const move = (index: number, delta: -1 | 1) => {
    const order = [...orderedIds];
    [order[index], order[index + delta]] = [order[index + delta], order[index]];
    dispatch({ type: "SET_STOP_ORDER", order });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Review delivery route
        </h2>
        <p className="text-xs text-slate-600">
          New trip • Review the stop sequence before confirming the delivery
          plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <section className={`${card} lg:col-span-3`}>
          {agency ? (
            <RouteMapPlaceholder
              depot={{
                id: agency.agencyId,
                name: `${agency.name} depot`,
                latitude: agency.latitude,
                longitude: agency.longitude,
              }}
              stops={orderedStops.map((s) => ({
                id: s.allocation.outletAllocationId,
                name: s.outlet.name,
                latitude: s.outlet.latitude,
                longitude: s.outlet.longitude,
              }))}
            />
          ) : (
            <p className="text-xs text-slate-500">Loading map…</p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Illustrative route • not a live map
          </p>
        </section>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <section className={card}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Stop sequence
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  modified
                    ? "bg-amber-100 text-amber-900"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {modified ? "Modified stop sequence" : "Planned stop sequence"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">— km • — min</p>

            <ol className="mt-4 flex flex-col gap-2">
              <li className="flex items-center gap-3 rounded-lg bg-slate-100 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                  A
                </span>
                <p className="text-sm text-slate-900">
                  <span className="font-semibold">
                    {agency?.name ?? "Agency"} depot
                  </span>{" "}
                  • Depart {formatClock(details.time)}
                </p>
              </li>

              {orderedStops.map((stop, index) => (
                <li
                  key={stop.allocation.outletAllocationId}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {stop.outlet.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {stop.outlet.city} • {formatUnits(stop.totalQty)} • ETA{" "}
                      {formatClock(details.time, MINUTES_PER_STOP * (index + 1))}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className={arrowBtn}
                      aria-label={`Move ${stop.outlet.name} up`}
                      disabled={index === 0}
                      onClick={() => move(index, -1)}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      className={arrowBtn}
                      aria-label={`Move ${stop.outlet.name} down`}
                      disabled={index === orderedStops.length - 1}
                      onClick={() => move(index, 1)}
                    >
                      ▼
                    </button>
                  </div>
                </li>
              ))}

              <li className="flex items-center gap-3 rounded-lg bg-slate-100 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                  A
                </span>
                <p className="text-sm font-semibold text-slate-900">
                  Return to depot
                </p>
              </li>
            </ol>
          </section>

          <section className={card}>
            <h3 className="text-base font-bold text-slate-900">Plan summary</h3>
            <p className={`${label} mt-3`}>Vehicle</p>
            <p className="text-sm font-medium text-slate-900">
              {chosen.vehicle?.regNo ?? "Not selected"}
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Driver: {chosen.driver?.fullName ?? "Not selected"}
            </p>
            <p className="text-sm text-slate-700">
              Agent: {chosen.agent?.fullname ?? "Not selected"}
            </p>
            <button
              type="button"
              className={`${linkBtn} mt-3`}
              onClick={() =>
                dispatch({ type: "GO_TO_STEP", step: "RESOURCES", tab: "DRIVER" })
              }
            >
              Change driver
            </button>
          </section>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className={outlineBtn}
          onClick={() => dispatch({ type: "GO_TO_STEP", step: "RESOURCES" })}
        >
          Back
        </button>
        <button
          type="button"
          className={primaryBtn}
          disabled={confirming}
          onClick={onConfirm}
        >
          {confirming ? "Confirming…" : "Confirm delivery plan"}
        </button>
      </div>
    </div>
  );
}

export default RouteReviewStep;
