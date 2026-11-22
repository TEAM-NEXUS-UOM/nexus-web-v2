import {
  type DispatchAllocation,
  type DispatchAllocationItem,
} from "../types/dispatch";

import { type Id } from "../types/common";
import { mockDispatchAllocations } from "../mock/dispatchAllocations";
import { mockDispatchAllocationItems } from "../mock/dispatchAllocationsItems";

export async function getDispatchAllocations(): Promise<DispatchAllocation[]> {
  return mockDispatchAllocations;
}

export async function getDispatchAllocationById(
  id: Id,
): Promise<DispatchAllocation | undefined> {
  return mockDispatchAllocations.find((d) => d.dispatchAllocationId === id);
}

export async function getItemsByDispatchId(
  dispatchId: Id,
): Promise<DispatchAllocationItem[]> {
  return mockDispatchAllocationItems.filter(
    (i) => i.dispatchAllocationId === dispatchId,
  );
}
