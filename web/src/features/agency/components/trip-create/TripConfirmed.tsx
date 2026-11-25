import { formatUnits, plural, vehicleTypeLabel } from "../../utils/format";
import { type ConfirmedPlan } from "./tripCreateState";
import { card, label, outlineBtn, primaryBtn } from "./ui";

interface Props {
  plan: ConfirmedPlan;
  onMonitor: () => void;
  onBack: () => void;
}

const departure = (scheduledAt: string) =>
  new Date(scheduledAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

function TripConfirmed({ plan, onMonitor, onBack }: Props) {
  const { trip, stops, vehicle, driver, agent } = plan;
  const totalQty = stops.reduce((sum, s) => sum + s.totalQty, 0);

  const resources = [
    { title: "Vehicle", value: `${vehicle.regNo} • ${vehicleTypeLabel[vehicle.vehicleType]}` },
    { title: "Driver", value: driver.fullName },
    { title: "Delivery agent", value: agent.fullname },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Delivery plan confirmed
        </h1>
        <p className="mt-1 text-xs text-slate-600 md:text-sm">
          {trip.tripCode} • {trip.tripName} • Ready for your team
        </p>
      </div>

      <section className={`${card} mx-auto w-full max-w-2xl text-center`}>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
          ✓
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Your next delivery is ready.
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          The trip, stock allocation and route have been shared with the
          assigned delivery agent.
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
          {resources.map((r) => (
            <div key={r.title} className="rounded-lg bg-slate-100 p-3">
              <dt className={label}>{r.title}</dt>
              <dd className="text-sm font-medium text-slate-900">{r.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs text-slate-600">
          {plural(stops.length, "retail outlet")} • {formatUnits(totalQty)} •
          Departure {departure(trip.scheduledAt)}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button type="button" className={outlineBtn} onClick={onBack}>
            Back to overview
          </button>
          <button type="button" className={primaryBtn} onClick={onMonitor}>
            Monitor delivery
          </button>
        </div>
      </section>
    </div>
  );
}

export default TripConfirmed;
