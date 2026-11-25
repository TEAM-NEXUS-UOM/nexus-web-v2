import { type Id, type AuditFields } from "./common";

export type RetailOrderStatus =
  | "PENDING"
  | "ALLOCATED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "DELIVERY_FAILED"
  | "CANCELLED";

export interface RetailOrder extends AuditFields {
  retailOrderId: Id;
  orderCode: string;
  agencyId: Id;
  outletId: Id;
  status: RetailOrderStatus;
  orderedAt: string;
}


export interface RetailOrderItem {
  retailOrderItemId: Id;
  retailOrderId: Id;
  productId: Id;
  quantity: number;
  unitPrice: number;
}
