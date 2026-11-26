import { type Trip } from "../types/trip.types";
import { type Vehicle } from "../types/vehicle.types";
import { type Driver } from "../types/driver";
import { type Agent } from "../types/agent.types";
import {
  type ResourceOption,
  type TripResourceOptions,
  type TripResourceQuery,
  type VehicleOption,
} from "../types/tripPlanning.types";

import { mockVehicles } from "../mock/vehicles";
import { mockDrivers } from "../mock/drivers";
import { mockAgents } from "../mock/agent";
import { getTripsByAgencyId } from "./tripService";

const BUSY_STATUSES: Trip["status"][] = ["PLANNED", "ASSIGNED", "IN_PROGRESS"];

// "Available first", then alphabetical by the given label.
function availableFirst<T extends ResourceOption<unknown>>(
  options: T[],
  label: (o: T) => string,
): T[] {
  return [...options].sort((a, b) =>
    a.eligible === b.eligible
      ? label(a).localeCompare(label(b))
      : a.eligible
        ? -1
        : 1,
  );
}

function vehicleOption(
  vehicle: Vehicle,
  busyTrip: Trip | undefined,
  loadKg: number,
): VehicleOption {
  const loadPercent =
    vehicle.capacityKg > 0 ? Math.round((loadKg / vehicle.capacityKg) * 100) : 0;

  let reason: string | null = null;
  if (vehicle.status === "MAINTENANCE") reason = "Maintenance";
  else if (vehicle.status !== "ACTIVE") reason = "Inactive";
  else if (busyTrip) reason = `On trip (${busyTrip.tripCode})`;
  else if (vehicle.capacityKg < loadKg)
    reason = `Too small (below required ${Math.ceil(loadKg)} kg)`;

  return { resource: vehicle, eligible: reason === null, reason, loadPercent };
}

function driverOption(
  driver: Driver,
  busyTrip: Trip | undefined,
  deliveryDate: string,
): ResourceOption<Driver> {
  let reason: string | null = null;
  if (driver.availability !== "AVAILABLE") reason = "Off duty";
  else if (driver.licenseExpiresAt.slice(0, 10) <= deliveryDate)
    reason = "Licence expired";
  else if (busyTrip) reason = `On trip (${busyTrip.tripCode})`;

  return { resource: driver, eligible: reason === null, reason };
}

function agentOption(
  agent: Agent,
  busyTrip: Trip | undefined,
): ResourceOption<Agent> {
  let reason: string | null = null;
  if (agent.status !== "ACTIVE") reason = "Inactive";
  else if (busyTrip) reason = `On trip (${busyTrip.tripCode})`;

  return { resource: agent, eligible: reason === null, reason };
}

export async function getTripResourceOptions({
  agencyId,
  deliveryDate,
  loadKg,
}: TripResourceQuery): Promise<TripResourceOptions> {
  // Trips that block a resource on the delivery date ("yyyy-mm-dd" prefix of scheduledAt).
  const busyTrips = (await getTripsByAgencyId(agencyId)).filter(
    (t) =>
      BUSY_STATUSES.includes(t.status) &&
      t.scheduledAt.slice(0, 10) === deliveryDate,
  );
  const busyTripFor = (match: (t: Trip) => boolean) => busyTrips.find(match);

  const vehicles = mockVehicles
    .filter((v) => v.agencyId === agencyId)
    .map((v) =>
      vehicleOption(
        v,
        busyTripFor((t) => t.vehicleId === v.vehicleId),
        loadKg,
      ),
    );

  const drivers = mockDrivers
    .filter((d) => d.agencyId === agencyId)
    .map((d) =>
      driverOption(
        d,
        busyTripFor((t) => t.driverId === d.driverId),
        deliveryDate,
      ),
    );

  const agents = mockAgents
    .filter((a) => a.agencyId === agencyId)
    .map((a) => agentOption(a, busyTripFor((t) => t.agentId === a.userId)));

  return {
    vehicles: availableFirst(vehicles, (o) => o.resource.regNo),
    drivers: availableFirst(drivers, (o) => o.resource.fullName),
    agents: availableFirst(agents, (o) => o.resource.fullname),
  };
}
