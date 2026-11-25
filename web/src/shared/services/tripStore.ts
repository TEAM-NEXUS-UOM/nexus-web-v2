// Internal localStorage store for trips, trip stops and outlet allocations.
// Only services import this file; components use tripService / outletAllocationService.
// When the real API arrives, those services call the API and this file is deleted.
import { type Trip } from "../types/trip.types";
import { type TripStop } from "../types/tripStop.types";
import { type OutletAllocation } from "../types/outletAllocation.types";

import { mockTrips } from "../mock/trips";
import { mockTripStops } from "../mock/tripStops";
import { mockOutletAllocations } from "../mock/outletAllocations";

export const TRIP_STORAGE_KEY = "nexus.agency.trips";

export interface TripStore {
  trips: Trip[];
  tripStops: TripStop[];
  outletAllocations: OutletAllocation[];
}

function seedStore(): TripStore {
  return structuredClone({
    trips: mockTrips,
    tripStops: mockTripStops,
    outletAllocations: mockOutletAllocations,
  });
}

function isTripStore(value: unknown): value is TripStore {
  if (typeof value !== "object" || value === null) return false;
  const store = value as Partial<TripStore>;
  return (
    Array.isArray(store.trips) &&
    Array.isArray(store.tripStops) &&
    Array.isArray(store.outletAllocations)
  );
}

export function loadTripStore(): TripStore {
  try {
    const raw = localStorage.getItem(TRIP_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isTripStore(parsed)) return parsed;
    }
  } catch {
    // Corrupt data: fall through and reseed from the mocks.
  }
  const seeded = seedStore();
  saveTripStore(seeded);
  return seeded;
}

export function saveTripStore(store: TripStore): void {
  localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(store));
}
