import { type Id, type AuditFields } from "./common";

export type DispatchAllocationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "DELIVERED"
  | "CANCELLED";

interface DispatchAllocation extends AuditFields {
  dispatchAllocationId: Id;
  scheduleId: Id;
  orederId: Id;
  agencyId: Id;
  scheduledAt: string;
  loadingBay: string;
  status: DispatchAllocationStatus;
  notes?: string;
}

interface DispatchAllocationItem {
  allocationItemId: Id;
  dispatchAllocationId: Id;
  orederItemId: Id;
  allocatedQty: number;
  loadedQty?: number;
  receivedQty?: number;
}

export type CreateDispatchRequest = Omit<
  DispatchAllocation,
  "dispatchAllocationId" | "status" | keyof AuditFields
>;

export type UpdateDispatchRequest = Partial<CreateDispatchRequest>;
