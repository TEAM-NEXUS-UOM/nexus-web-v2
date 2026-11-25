import { type Id, type AuditFields } from "./common";

export type TripType = "DISPATCH" | "DELIVERY";

export type TripStatus =
  | "DRAFT"
  | "PLANNED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Trip extends AuditFields {
  tripId: Id;
  tripCode: string;
  tripName: string;
  agencyId: Id;
  tripType: TripType;
  status: TripStatus;
  scheduledAt: string;
  vehicleId: Id | null;
  driverId: Id | null;
  agentId: Id | null;
  startedAt: string | null;
  completedAt: string | null;
}

export type CreateTripRequest = Pick<
  Trip,
  "tripName" | "tripType" | "scheduledAt" | "vehicleId" | "driverId" | "agentId"
>;

export type AssignTripRequest = Pick<Trip, "vehicleId" | "driverId" | "agentId">;

export type UpdateTripStatusRequest = Pick<Trip, "status">;
