import { type Id } from "../types/common";
import { type Trip } from "../types/trip.types";
import { type TripStop } from "../types/tripStop.types";
import {
  type CreateDeliveryTripInput,
  type TripListItem,
} from "../types/tripPlanning.types";

import { mockVehicles } from "../mock/vehicles";
import { mockDrivers } from "../mock/drivers";
import { mockAgents } from "../mock/agent";
import { loadTripStore, saveTripStore } from "./tripStore";

const MINUTES_PER_STOP = 20; // placeholder ETA until real route calculation exists

export async function getTripsByAgencyId(agencyId: Id): Promise<Trip[]> {
  return loadTripStore().trips.filter((t) => t.agencyId === agencyId);
}

export async function getTripStops(): Promise<TripStop[]> {
  return loadTripStore().tripStops;
}

// Delivery trips of an agency with their resources and stop progress.
export async function getDeliveryTripList(
  agencyId: Id,
): Promise<TripListItem[]> {
  const { trips, tripStops, outletAllocations } = loadTripStore();

  return trips
    .filter((t) => t.agencyId === agencyId && t.tripType === "DELIVERY")
    .map((trip) => {
      const stops = tripStops.filter((s) => s.tripId === trip.tripId);
      // Trips still being planned may only have allocations, not stops yet.
      const outletIds = new Set([
        ...stops.map((s) => s.outletId),
        ...outletAllocations
          .filter((a) => a.tripId === trip.tripId)
          .map((a) => a.outletId),
      ]);
      return {
        trip,
        vehicle: mockVehicles.find((v) => v.vehicleId === trip.vehicleId) ?? null,
        driver: mockDrivers.find((d) => d.driverId === trip.driverId) ?? null,
        agent: mockAgents.find((a) => a.userId === trip.agentId) ?? null,
        outletCount: outletIds.size,
        stopsTotal: stops.length,
        stopsDelivered: stops.filter((s) => s.status === "DELIVERED").length,
        stopsFailed: stops.filter((s) => s.status === "FAILED").length,
      };
    });
}

function nextTripCode(trips: Trip[]): string {
  const highest = trips.reduce((max, t) => {
    const n = Number(t.tripCode.replace("TRP-", ""));
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `TRP-${String(highest + 1).padStart(4, "0")}`;
}

// Keep the mocks' local "yyyy-mm-ddTHH:mm:ss" format (no timezone suffix).
function addMinutesLocal(scheduledAt: string, minutes: number): string {
  const d = new Date(scheduledAt);
  d.setMinutes(d.getMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:00`
  );
}

export async function createDeliveryTrip(
  input: CreateDeliveryTripInput,
): Promise<Trip> {
  const store = loadTripStore();
  const now = new Date().toISOString();

  const allocations = input.outletAllocationIds.map((id) => {
    const allocation = store.outletAllocations.find(
      (a) => a.outletAllocationId === id,
    );
    if (
      !allocation ||
      allocation.agencyId !== input.agencyId ||
      allocation.status !== "READY"
    ) {
      throw new Error("One of the selected allocations is no longer ready.");
    }
    return allocation;
  });
  if (allocations.length === 0) {
    throw new Error("Select at least one allocation.");
  }

  const trip: Trip = {
    tripId: `t-${crypto.randomUUID()}`,
    tripCode: nextTripCode(store.trips),
    tripName: input.tripName,
    operationalArea: input.operationalArea,
    agencyId: input.agencyId,
    tripType: "DELIVERY",
    status: "ASSIGNED",
    scheduledAt: input.scheduledAt,
    vehicleId: input.vehicleId,
    driverId: input.driverId,
    agentId: input.agentId,
    startedAt: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  const stops: TripStop[] = allocations.map((allocation, index) => ({
    tripStopId: `ts-${crypto.randomUUID()}`,
    tripId: trip.tripId,
    outletId: allocation.outletId,
    retailOrderId: allocation.retailOrderId,
    sequence: index + 1,
    status: "PENDING",
    eta: addMinutesLocal(input.scheduledAt, MINUTES_PER_STOP * (index + 1)),
    arrivedAt: null,
    deliveredAt: null,
    failureReason: null,
  }));

  const usedIds = new Set(input.outletAllocationIds);
  saveTripStore({
    trips: [...store.trips, trip],
    tripStops: [...store.tripStops, ...stops],
    outletAllocations: store.outletAllocations.map((a) =>
      usedIds.has(a.outletAllocationId)
        ? {
            ...a,
            status: "ASSIGNED_TO_TRIP",
            tripId: trip.tripId,
            updatedAt: now,
          }
        : a,
    ),
  });

  return trip;
}
