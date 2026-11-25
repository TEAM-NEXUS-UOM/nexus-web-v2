import { type Dispatch } from "react";
import { type TripResourceOptions } from "../../../../shared/types/tripPlanning.types";
import {
  formatClock,
  formatDate,
  formatKg,
  formatUnits,
  vehicleTypeLabel,
} from "../../utils/format";
import ResourceList, { type ResourceRow } from "./ResourceList";
import SelectionPanel from "./SelectionPanel";
import {
  type ChosenResources,
  type LoadTotals,
  type ResourceTab,
  type TripCreateAction,
  type TripCreateState,
} from "./tripCreateState";
import { card, linkBtn, outlineBtn, primaryBtn } from "./ui";

interface Props {
  state: TripCreateState;
  dispatch: Dispatch<TripCreateAction>;
  options: TripResourceOptions | undefined;
  optionsLoading: boolean;
  totals: LoadTotals;
  chosen: ChosenResources;
}

const tabs: { tab: ResourceTab; text: string }[] = [
  { tab: "VEHICLE", text: "Vehicle" },
  { tab: "DRIVER", text: "Driver" },
  { tab: "AGENT", text: "Delivery agent" },
  { tab: "REVIEW", text: "Review" },
];

function ResourceStep({
  state,
  dispatch,
  options,
  optionsLoading,
  totals,
  chosen,
}: Props) {
  const { details, resourceTab } = state;
  const forLabel = `For ${formatDate(details.date)} • ${formatClock(details.time)}`;
  const allChosen = !!(chosen.vehicle && chosen.driver && chosen.agent);

  const vehicleRows: ResourceRow[] = (options?.vehicles ?? []).map((o) => ({
    id: o.resource.vehicleId,
    title: o.resource.regNo,
    meta: `${vehicleTypeLabel[o.resource.vehicleType]} • ${o.resource.capacityKg.toLocaleString("en-US")} kg capacity • ${o.loadPercent}% load`,
    searchText: `${o.resource.regNo} ${o.resource.vehicleId} ${o.resource.vehicleType}`,
    eligible: o.eligible,
    reason: o.reason,
  }));

  const driverRows: ResourceRow[] = (options?.drivers ?? []).map((o) => ({
    id: o.resource.driverId,
    title: o.resource.fullName,
    meta: o.resource.phone,
    searchText: `${o.resource.fullName} ${o.resource.driverId} ${o.resource.phone} ${o.resource.licenseNo}`,
    eligible: o.eligible,
    reason: o.reason,
  }));

  const agentRows: ResourceRow[] = (options?.agents ?? []).map((o) => ({
    id: o.resource.userId,
    title: o.resource.fullname,
    meta: `${o.resource.employeeCode} • ${o.resource.phone} • ${o.resource.city}`,
    searchText: `${o.resource.fullname} ${o.resource.employeeCode} ${o.resource.phone}`,
    eligible: o.eligible,
    reason: o.reason,
  }));

  const reviewItems: { title: string; value: string | null; tab: ResourceTab }[] = [
    {
      title: "Vehicle",
      value: chosen.vehicle
        ? `${chosen.vehicle.regNo} • ${vehicleTypeLabel[chosen.vehicle.vehicleType]} • ${chosen.vehicle.capacityKg.toLocaleString("en-US")} kg`
        : null,
      tab: "VEHICLE",
    },
    {
      title: "Driver",
      value: chosen.driver ? `${chosen.driver.fullName} • ${chosen.driver.phone}` : null,
      tab: "DRIVER",
    },
    {
      title: "Delivery agent",
      value: chosen.agent ? `${chosen.agent.fullname} • ${chosen.agent.phone}` : null,
      tab: "AGENT",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">
          Assign vehicle & team
        </h2>
        <p className="text-xs text-slate-600">
          New trip • {details.area || "No area"} • {formatDate(details.date)},{" "}
          {formatClock(details.time)} • {formatKg(totals.totalKg)} kg /{" "}
          {formatUnits(totals.totalQty)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`}>
          <div role="tablist" className="mb-4 flex flex-wrap gap-2">
            {tabs.map(({ tab, text }, index) => {
              const active = tab === resourceTab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => dispatch({ type: "SET_TAB", tab })}
                  className={`cursor-pointer rounded-md px-4 py-2 text-sm ${
                    active
                      ? "bg-primary font-semibold text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {index + 1} {text}
                </button>
              );
            })}
          </div>

          {resourceTab === "VEHICLE" && (
            <ResourceList
              key="VEHICLE"
              rows={vehicleRows}
              selectedId={state.vehicleId}
              onSelect={(id) => dispatch({ type: "SELECT_VEHICLE", id })}
              searchPlaceholder="Search by registration, ID or type"
              forLabel={forLabel}
              loading={optionsLoading}
              emptyText="No vehicles are registered for this agency."
            />
          )}
          {resourceTab === "DRIVER" && (
            <ResourceList
              key="DRIVER"
              rows={driverRows}
              selectedId={state.driverId}
              onSelect={(id) => dispatch({ type: "SELECT_DRIVER", id })}
              searchPlaceholder="Search by name, ID or phone"
              forLabel={forLabel}
              loading={optionsLoading}
              emptyText="No drivers are registered for this agency."
            />
          )}
          {resourceTab === "AGENT" && (
            <ResourceList
              key="AGENT"
              rows={agentRows}
              selectedId={state.agentId}
              onSelect={(id) => dispatch({ type: "SELECT_AGENT", id })}
              searchPlaceholder="Search by name, ID or phone"
              forLabel={forLabel}
              loading={optionsLoading}
              emptyText="No delivery agents are registered for this agency."
            />
          )}
          {resourceTab === "REVIEW" && (
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-slate-900">
                {allChosen ? "All resources are ready" : "Some resources are missing"}
              </h3>
              {reviewItems.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between gap-3 rounded-lg bg-slate-100 p-3"
                >
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {item.title}
                    </p>
                    <p
                      className={`text-sm ${item.value ? "font-medium text-slate-900" : "text-slate-400"}`}
                    >
                      {item.value ?? "Not selected"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={linkBtn}
                    onClick={() => dispatch({ type: "SET_TAB", tab: item.tab })}
                  >
                    {item.value ? "Change" : "Select"}
                  </button>
                </div>
              ))}
              {allChosen && (
                <p className="text-xs font-medium text-green-700">
                  ✓ Capacity checked • No scheduling conflicts
                </p>
              )}
            </div>
          )}
        </section>

        <SelectionPanel details={details} totals={totals} chosen={chosen} />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className={outlineBtn}
          onClick={() => dispatch({ type: "GO_TO_STEP", step: "DETAILS" })}
        >
          Back to trip details
        </button>
        <button
          type="button"
          className={primaryBtn}
          disabled={!allChosen}
          onClick={() => dispatch({ type: "GO_TO_STEP", step: "ROUTE" })}
        >
          Continue to route
        </button>
      </div>
    </div>
  );
}

export default ResourceStep;
