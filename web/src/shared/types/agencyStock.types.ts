import { type Id } from "./common";
import { type Product } from "./product.types";

export interface AgencyStock {
  agencyStockId: Id;
  agencyId: Id;
  productId: Id;
  onHandQty: number;
  updatedAt: string;
}

// View model returned by agencyStockService — computed, never stored.
export interface AgencyStockSummary {
  product: Product;
  onHandQty: number;
  allocatedQty: number;
  availableQty: number;
}
