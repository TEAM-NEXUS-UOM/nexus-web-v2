import { type AgencyAlert } from "./agencyAlert.types";
import { type DispatchAllocation } from "./dispatch";
import { type Trip } from "./trip.types";

// View model returned by the dashboard service — computed, never stored.
export type TripNextAction =
  | "ASSIGN_DRIVER"
  | "ASSIGN_VEHICLE"
  | "CONTINUE_SETUP"
  | "READY";

export interface TripToPrepare {
  trip: Trip;
  outletCount: number;
  nextAction: TripNextAction;
}

export interface AgencyDashboardSummary {
  dispatchesToReview: number;
  activeDeliveries: number;
  stops: { completed: number; total: number };
  availableDrivers: number;
  allocationsReady: number;
  tripsNeedingDriver: number;
  tripsToPrepare: TripToPrepare[];
  incomingDispatch: DispatchAllocation | null;
  tracking: { onSchedule: number; delayed: number; offline: number };
  latestAlert: AgencyAlert | null;
}
