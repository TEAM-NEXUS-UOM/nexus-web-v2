import { type Dispatch } from "react";
import { type AllocationDetail } from "../../../../shared/types/tripPlanning.types";
import { formatKg, formatUnits } from "../../utils/format";
import SelectedAllocationCard from "./SelectedAllocationCard";
import {
  type TripCreateAction,
  type TripCreateState,
  type TripDetails,
} from "./tripCreateState";
import { card, input, label, outlineBtn, primaryBtn } from "./ui";

interface Props {
  state: TripCreateState;
  dispatch: Dispatch<TripCreateAction>;
  readyAllocations: AllocationDetail[];
  allocationsLoading: boolean;
  selected: AllocationDetail[];
  totalQty: number;
  totalKg: number;
  onCancel: () => void;
}

const fields: {
  field: keyof TripDetails;
  text: string;
  type: string;
  placeholder?: string;
}[] = [
  { field: "tripName", text: "Trip name", type: "text", placeholder: "e.g. Colombo South run" },
  { field: "date", text: "Delivery date", type: "date" },
  { field: "time", text: "Departure time", type: "time" },
  { field: "area", text: "Operational area", type: "text", placeholder: "e.g. Dehiwala & Ja-Ela" },
];

function TripDetailsStep({
  state,
  dispatch,
  readyAllocations,
  allocationsLoading,
  selected,
  totalQty,
  totalKg,
  onCancel,
}: Props) {
  const { details } = state;
  const canContinue =
    details.tripName.trim() !== "" &&
    details.date !== "" &&
    details.time !== "" &&
    selected.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className={`${card} lg:col-span-2`}>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Delivery details
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <label
                key={f.field}
                className={`flex flex-col gap-1.5 ${f.field === "tripName" || f.field === "area" ? "sm:col-span-2" : ""}`}
              >
                <span className={label}>{f.text}</span>
                <input
                  type={f.type}
                  className={input}
                  placeholder={f.placeholder}
                  value={details[f.field]}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_DETAIL",
                      field: f.field,
                      value: e.target.value,
                    })
                  }
                />
              </label>
            ))}
          </div>

          <fieldset className="mt-5">
            <legend className={label}>Stock allocation</legend>
            <p className="mt-1 text-xs text-slate-500">
              Choose the ready allocations to deliver on this trip.
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {allocationsLoading && (
                <p className="text-xs text-slate-500">Loading allocations…</p>
              )}
              {!allocationsLoading && readyAllocations.length === 0 && (
                <p className="text-xs text-slate-500">
                  No allocations are ready. Allocate stock to outlets first.
                </p>
              )}
              {readyAllocations.map((d) => {
                const id = d.allocation.outletAllocationId;
                const checked = state.allocationIds.includes(id);
                return (
                  <label
                    key={id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-primary"
                      checked={checked}
                      onChange={() =>
                        dispatch({ type: "TOGGLE_ALLOCATION", id })
                      }
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900">
                        {d.outlet.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {d.outlet.city} • {formatUnits(d.totalQty)} •{" "}
                        {formatKg(d.totalWeightKg)} kg
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </section>

        <SelectedAllocationCard
          selected={selected}
          totalQty={totalQty}
          totalKg={totalKg}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" className={outlineBtn} onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className={primaryBtn}
          disabled={!canContinue}
          onClick={() => dispatch({ type: "GO_TO_STEP", step: "RESOURCES" })}
        >
          Continue to resources
        </button>
      </div>
    </div>
  );
}

export default TripDetailsStep;
