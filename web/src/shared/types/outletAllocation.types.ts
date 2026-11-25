import { type Id, type AuditFields } from "./common";


export type OutletAllocationStatus = "DRAFT" | "READY" | "ASSIGNED_TO_TRIP";

export interface OutletAllocation extends AuditFields {
  outletAllocationId: Id;
  agencyId: Id;
  outletId: Id;
  retailOrderId: Id;
  tripId: Id | null;
  status: OutletAllocationStatus;
}
