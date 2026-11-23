import { type Id, type AuditFields } from "./common";

export type DispatchAllocationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "DELIVERED"
  | "CANCELLED";

export interface DispatchAllocation extends AuditFields {
  dispatchAllocationId: Id;
  scheduleId: Id;
  orderId: Id;
  agencyId: Id;
  scheduledAt: string;
  loadingBay: string;
  status: DispatchAllocationStatus;
  notes?: string;
}

export interface DispatchAllocationItem {
  dispatchAllocationItemId: Id;
  dispatchAllocationId: Id;
  orderItemId: Id;
  allocatedQty: number;
  loadedQty?: number;
  receivedQty?: number;
}

export type CreateDispatchRequest = Omit<
  DispatchAllocation,
  "dispatchAllocationId" | "status" | keyof AuditFields
>;

export type UpdateDispatchRequest = Partial<CreateDispatchRequest>;

export type UpdateDispatchRequestStatus = Pick<DispatchAllocation, "status">;

export type CreateDispatchAllocationItem = Omit<
  DispatchAllocationItem,
  "dispatchAllocationItemId" | "receivedQty" | "loadedQty"
>;

export type UpdateDispatchAllocationItem = Partial<
  Pick<
    DispatchAllocationItem,
    "allocatedQty" | "loadedQty" | "orderItemId" | "receivedQty"
  >
>;
