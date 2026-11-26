import { type Id } from "../types/common";
import { type AgencyStockSummary } from "../types/agencyStock.types";

import { mockAgencyStock } from "../mock/agencyStock";
import { mockProducts } from "../mock/products";
import {
  getOrderLines,
  getOutletAllocationsByAgencyId,
} from "./outletAllocationService";

// "Allocated" = quantities of READY or ASSIGNED_TO_TRIP allocations; Available = on hand − allocated.
export async function getAgencyStockSummary(
  agencyId: Id,
): Promise<AgencyStockSummary[]> {
  const allocations = await getOutletAllocationsByAgencyId(agencyId);

  const allocatedByProduct = new Map<Id, number>();
  allocations
    .filter((a) => a.status === "READY" || a.status === "ASSIGNED_TO_TRIP")
    .flatMap((a) => getOrderLines(a.retailOrderId))
    .forEach((line) => {
      const id = line.product.productId;
      allocatedByProduct.set(
        id,
        (allocatedByProduct.get(id) ?? 0) + line.quantity,
      );
    });

  return mockAgencyStock
    .filter((s) => s.agencyId === agencyId)
    .flatMap((stock) => {
      const product = mockProducts.find((p) => p.productId === stock.productId);
      if (!product) return [];
      const allocatedQty = allocatedByProduct.get(product.productId) ?? 0;
      return [
        {
          product,
          onHandQty: stock.onHandQty,
          allocatedQty,
          availableQty: stock.onHandQty - allocatedQty,
        },
      ];
    });
}
