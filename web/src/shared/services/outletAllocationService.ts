import { type Id } from "../types/common";
import { type OutletAllocation } from "../types/outletAllocation.types";
import { type Product } from "../types/product.types";
import {
  type AllocationDetail,
  type AllocationLine,
} from "../types/tripPlanning.types";

import { mockRetailOrderItems } from "../mock/retailOrders";
import { mockRetailOutlets } from "../mock/retailOutlets";
import { mockProducts } from "../mock/products";
import { loadTripStore } from "./tripStore";

export async function getOutletAllocationsByAgencyId(
  agencyId: Id,
): Promise<OutletAllocation[]> {
  return loadTripStore().outletAllocations.filter(
    (a) => a.agencyId === agencyId,
  );
}

// Quantities of each product in one retail order (OutletAllocation → retailOrderId → items).
export function getOrderLines(retailOrderId: Id): AllocationLine[] {
  return mockRetailOrderItems
    .filter((item) => item.retailOrderId === retailOrderId)
    .map((item) => ({
      product: mockProducts.find((p) => p.productId === item.productId),
      quantity: item.quantity,
    }))
    .filter((line): line is AllocationLine => line.product !== undefined);
}

const lineWeightKg = (product: Product, quantity: number) =>
  (product.unitWeightKg ?? 0) * quantity;

function toDetail(allocation: OutletAllocation): AllocationDetail | null {
  const outlet = mockRetailOutlets.find(
    (o) => o.outletId === allocation.outletId,
  );
  if (!outlet) return null;

  const lines = getOrderLines(allocation.retailOrderId);
  return {
    allocation,
    outlet,
    lines,
    totalQty: lines.reduce((sum, l) => sum + l.quantity, 0),
    totalWeightKg: lines.reduce(
      (sum, l) => sum + lineWeightKg(l.product, l.quantity),
      0,
    ),
  };
}

export async function getReadyAllocationDetails(
  agencyId: Id,
): Promise<AllocationDetail[]> {
  const allocations = await getOutletAllocationsByAgencyId(agencyId);
  return allocations
    .filter((a) => a.status === "READY")
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map(toDetail)
    .filter((d): d is AllocationDetail => d !== null);
}
