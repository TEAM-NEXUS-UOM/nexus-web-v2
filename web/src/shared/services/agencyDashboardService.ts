import { type Id } from "../types/common";
import { type Trip } from "../types/trip.types";
import { type TripStop } from "../types/tripStop.types";
import { type OutletAllocation } from "../types/outletAllocation.types";
import {
  type AgencyDashboardSummary,
  type TripNextAction,
  type TripToPrepare,
} from "../types/agencyDashboard.types";

import { mockTripTracking } from "../mock/tripTracking";
import { mockAgencyAlerts } from "../mock/agencyAlerts";
import { mockDispatchAllocations } from "../mock/dispatchAllocations";
import { mockDrivers } from "../mock/drivers";
import { getTripStops, getTripsByAgencyId } from "./tripService";
import { getOutletAllocationsByAgencyId } from "./outletAllocationService";

const PREPARE_STATUSES: Trip["status"][] = ["DRAFT", "PLANNED", "ASSIGNED"];

function getNextAction(trip: Trip): TripNextAction {
  if (trip.status === "DRAFT") return "CONTINUE_SETUP";
  if (!trip.driverId) return "ASSIGN_DRIVER";
  if (!trip.vehicleId) return "ASSIGN_VEHICLE";
  return "READY";
}

function countOutlets(
  tripId: Id,
  tripStops: TripStop[],
  allocations: OutletAllocation[],
): number {
  const outletIds = new Set<Id>();
  tripStops
    .filter((s) => s.tripId === tripId)
    .forEach((s) => outletIds.add(s.outletId));
  allocations
    .filter((a) => a.tripId === tripId)
    .forEach((a) => outletIds.add(a.outletId));
  return outletIds.size;
}

const byTime = (a: string, b: string) =>
  new Date(a).getTime() - new Date(b).getTime();

export async function getAgencyDashboardSummary(
  agencyId: Id,
): Promise<AgencyDashboardSummary> {
  const [trips, tripStops, allocations] = await Promise.all([
    getTripsByAgencyId(agencyId),
    getTripStops(),
    getOutletAllocationsByAgencyId(agencyId),
  ]);
  const activeTrips = trips.filter((t) => t.status === "IN_PROGRESS");
  const activeTripIds = new Set(activeTrips.map((t) => t.tripId));

  const pendingDispatches = mockDispatchAllocations
    .filter((d) => d.agencyId === agencyId && d.status === "PENDING")
    .sort((a, b) => byTime(a.scheduledAt, b.scheduledAt));

  const countedTripIds = new Set(
    trips
      .filter((t) => t.status === "IN_PROGRESS" || t.status === "COMPLETED")
      .map((t) => t.tripId),
  );
  const stops = tripStops.filter((s) => countedTripIds.has(s.tripId));

  const busyDriverIds = new Set(activeTrips.map((t) => t.driverId));
  const availableDrivers = mockDrivers.filter(
    (d) =>
      d.agencyId === agencyId &&
      d.availability === "AVAILABLE" &&
      !busyDriverIds.has(d.driverId),
  ).length;

  const tripsToPrepare: TripToPrepare[] = trips
    .filter((t) => PREPARE_STATUSES.includes(t.status))
    .sort((a, b) => byTime(a.scheduledAt, b.scheduledAt))
    .map((trip) => ({
      trip,
      outletCount: countOutlets(trip.tripId, tripStops, allocations),
      nextAction: getNextAction(trip),
    }));

  const tracking = { onSchedule: 0, delayed: 0, offline: 0 };
  mockTripTracking
    .filter((tr) => activeTripIds.has(tr.tripId))
    .forEach((tr) => {
      if (tr.state === "ON_SCHEDULE") tracking.onSchedule++;
      else if (tr.state === "DELAYED") tracking.delayed++;
      else tracking.offline++;
    });

  const alerts = mockAgencyAlerts
    .filter((a) => a.agencyId === agencyId)
    .sort((a, b) => byTime(b.createdAt, a.createdAt));
  const latestAlert = alerts.find((a) => !a.isRead) ?? alerts[0] ?? null;

  return {
    dispatchesToReview: pendingDispatches.length,
    activeDeliveries: activeTrips.length,
    stops: {
      completed: stops.filter((s) => s.status === "DELIVERED").length,
      total: stops.length,
    },
    availableDrivers,
    allocationsReady: allocations.filter((a) => a.status === "READY").length,
    tripsNeedingDriver: tripsToPrepare.filter((t) => !t.trip.driverId).length,
    tripsToPrepare,
    incomingDispatch: pendingDispatches[0] ?? null,
    tracking,
    latestAlert,
  };
}
