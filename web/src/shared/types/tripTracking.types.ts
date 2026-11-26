import { type Id } from "./common";

export type TrackingState = "ON_SCHEDULE" | "DELAYED" | "OFFLINE";

export interface TripTracking {
  tripId: Id;
  state: TrackingState;
  delayMinutes: number;
  lastUpdateAt: string;
  latitude: number | null;
  longitude: number | null;
  currentStopId: Id | null;
}
