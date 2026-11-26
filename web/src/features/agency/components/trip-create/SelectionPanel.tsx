import { formatClock, formatDate, formatKg, plural, vehicleTypeLabel } from "../../utils/format";
import {
  type ChosenResources,
  type LoadTotals,
  type TripDetails,
} from "./tripCreateState";
import { card, label } from "./ui";

interface Props {
  details: TripDetails;
  totals: LoadTotals;
  chosen: ChosenResources;
}

function SelectionPanel({ details, totals, chosen }: Props) {
  const items = [
    {
      title: "Vehicle",
      value: chosen.vehicle
        ? `${chosen.vehicle.regNo} • ${vehicleTypeLabel[chosen.vehicle.vehicleType]}`
        : null,
    },
    { title: "Driver", value: chosen.driver?.fullName ?? null },
    { title: "Delivery agent", value: chosen.agent?.fullname ?? null },
  ];

  return (
    <aside className={`${card} h-fit`}>
      <h2 className="text-lg font-bold text-slate-900">Your selection</h2>
      <p className="mt-3 text-sm font-semibold text-slate-900">
        {details.tripName}
      </p>
      <p className="text-xs text-slate-500">
        {formatDate(details.date)} • {formatClock(details.time)}
      </p>
      <p className="text-xs text-slate-500">
        {plural(totals.outletCount, "outlet")} • {formatKg(totals.totalKg)} kg
      </p>

      <dl className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.title}>
            <dt className={label}>{item.title}</dt>
            <dd
              className={`text-sm ${item.value ? "font-medium text-slate-900" : "text-slate-400"}`}
            >
              {item.value ?? "Not selected"}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-slate-500">
        Only available and eligible resources can be assigned.
      </p>
    </aside>
  );
}

export default SelectionPanel;
