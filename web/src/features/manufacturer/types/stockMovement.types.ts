
export type StockMovementType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "RESERVATION"
  | "RELEASE"
  | "ADJUSTMENT";

export interface StockMovement {
  movementId: string;
  productId: string;
  performedBy: string;
  movementType: StockMovementType;
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  note: string | null;
  createdAt: string;
}
