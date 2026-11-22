import { type DispatchAllocation } from "../types/dispatch";

export const mockDispatchAllocations: DispatchAllocation[] = [
  {
    dispatchAllocationId: "1",
    scheduleId: "1",
    orderId: "1",
    agencyId: "1",
    scheduledAt: "2026-11-23T09:00:00",
    loadingBay: "B3",
    status: "PENDING",
    createdAt: "2026-11-22T10:00:00",
    updatedAt: "2026-11-22T10:00:00",
  },

  {
    dispatchAllocationId: "2",
    scheduleId: "2",
    orderId: "2",
    agencyId: "2",
    scheduledAt: "2026-12-23T09:00:00",
    loadingBay: "B4",
    status: "ACCEPTED",
    createdAt: "2026-11-22T10:00:00",
    updatedAt: "2026-11-22T10:00:01",
  },
];
