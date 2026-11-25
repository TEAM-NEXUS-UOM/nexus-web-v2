import { type Id } from "./common";

export type AlertType =
  | "TRIP_DELAYED"
  | "DRIVER_OFFLINE"
  | "STOP_FAILED"
  | "DISPATCH_SHORTAGE";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface AgencyAlert {
  alertId: Id;
  agencyId: Id;
  alertType: AlertType;
  severity: AlertSeverity;
  message: string;
  refId: Id | null; // tripId / tripStopId / dispatchAllocationId
  isRead: boolean;
  createdAt: string;
}
