import { type TripTracking } from "../types/tripTracking.types";

export const mockTripTracking: TripTracking[] = [
  {
    tripId: "t-001",
    state: "DELAYED",
    delayMinutes: 15,
    lastUpdateAt: "2026-11-25T10:36:00",
    latitude: 7.1402,
    longitude: 79.8701,
    currentStopId: "ts-003",
  },
  {
    tripId: "t-002",
    state: "ON_SCHEDULE",
    delayMinutes: 0,
    lastUpdateAt: "2026-11-25T10:30:00",
    latitude: 6.8511,
    longitude: 79.8653,
    currentStopId: "ts-005",
  },
  {
    tripId: "t-003",
    state: "OFFLINE",
    delayMinutes: 0,
    lastUpdateAt: "2026-11-25T10:05:00",
    latitude: null,
    longitude: null,
    currentStopId: null,
  },
  {
    tripId: "t-008",
    state: "ON_SCHEDULE",
    delayMinutes: 0,
    lastUpdateAt: "2026-11-25T10:00:00",
    latitude: 6.8480,
    longitude: 79.9265,
    currentStopId: "ts-010",
  },
];
