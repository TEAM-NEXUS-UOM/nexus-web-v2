import { type Id } from "./common";

export type TripStopStatus =
  | "PENDING"
  | "ARRIVED"
  | "DELIVERED"
  | "FAILED"
  | "SKIPPED";

export interface TripStop {
  tripStopId: Id;
  tripId: Id;
  outletId: Id;
  retailOrderId: Id;
  sequence: number;
  status: TripStopStatus;
  eta: string | null;
  arrivedAt: string | null;
  deliveredAt: string | null;
  failureReason: string | null;
}

export type CreateTripStopRequest = Pick<
  TripStop,
  "outletId" | "retailOrderId" | "sequence"
>;

export type UpdateTripStopStatusRequest = Pick<
  TripStop,
  "status" | "failureReason"
>;
