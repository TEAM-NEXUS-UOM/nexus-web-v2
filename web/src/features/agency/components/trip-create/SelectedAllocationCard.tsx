import { type AllocationDetail } from "../../../../shared/types/tripPlanning.types";
import { formatKg, formatUnits, pad2 } from "../../utils/format";
import { card, label, pill } from "./ui";

interface Props {
  selected: AllocationDetail[];
  totalQty: number;
  totalKg: number;
}

function SelectedAllocationCard({ selected, totalQty, totalKg }: Props) {
  return (
    <section className={card}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">Selected allocation</h2>
        {selected.length > 0 && (
          <span className={`${pill} bg-green-100 text-green-800`}>
            Stock available
          </span>
        )}
      </div>

      {selected.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">
          Choose at least one stock allocation to see the load and stops.
        </p>
      ) : (
        <>
          <p className="mt-4 text-3xl font-bold text-slate-900">
            {formatUnits(totalQty)}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            {formatKg(totalKg)} kg estimated load
          </p>

          <p className={`${label} mt-5`}>Delivery stops</p>
          <ol className="mt-2 flex flex-col gap-2">
            {selected.map((d, index) => (
              <li
                key={d.allocation.outletAllocationId}
                className="flex items-start gap-3 rounded-lg bg-slate-100 p-3"
              >
                <span className="text-sm font-bold text-primary">
                  {pad2(index + 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {d.outlet.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {d.outlet.city} • {formatUnits(d.totalQty)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      <p className="mt-4 text-xs text-slate-500">
        Vehicle capacity is checked in the next step.
      </p>
    </section>
  );
}

export default SelectedAllocationCard;
