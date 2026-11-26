import { useReducer } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../shared/components/auth";
import { getAgencyById } from "../../../shared/services/agencyService";
import { getReadyAllocationDetails } from "../../../shared/services/outletAllocationService";
import { getTripResourceOptions } from "../../../shared/services/tripResourceService";
import { createDeliveryTrip } from "../../../shared/services/tripService";
import { type AllocationDetail } from "../../../shared/types/tripPlanning.types";
import { todayLocal } from "../utils/format";
import StepBar from "../components/trip-create/StepBar";
import TripDetailsStep from "../components/trip-create/TripDetailsStep";
import ResourceStep from "../components/trip-create/ResourceStep";
import RouteReviewStep from "../components/trip-create/RouteReviewStep";
import TripConfirmed from "../components/trip-create/TripConfirmed";
import {
  createInitialState,
  tripCreateReducer,
  type ChosenResources,
  type LoadTotals,
} from "../components/trip-create/tripCreateState";

// "?allocations=oa-008,oa-009" → ["oa-008", "oa-009"]
const parseIds = (param: string | null) =>
  (param ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

function CreateTrip() {
  const { user } = useAuth();
  const agencyId = user?.agencyId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [state, dispatch] = useReducer(
    tripCreateReducer,
    searchParams.get("allocations"),
    (param) => createInitialState(parseIds(param), todayLocal()),
  );
  const { step, details } = state;

  const { data: agency } = useQuery({
    queryKey: ["agency", agencyId],
    queryFn: () => getAgencyById(agencyId),
    enabled: !!agencyId,
  });

  const { data: readyAllocations = [], isLoading: allocationsLoading } =
    useQuery({
      queryKey: ["outletAllocations", agencyId, "ready"],
      queryFn: () => getReadyAllocationDetails(agencyId),
      enabled: !!agencyId,
    });

  // Planned order = order of the ready list; unknown ids from the URL are ignored.
  const selected = readyAllocations.filter((d) =>
    state.allocationIds.includes(d.allocation.outletAllocationId),
  );
  const totals: LoadTotals = {
    outletCount: selected.length,
    totalQty: selected.reduce((sum, d) => sum + d.totalQty, 0),
    totalKg: selected.reduce((sum, d) => sum + d.totalWeightKg, 0),
  };

  const { data: resourceOptions, isLoading: resourcesLoading } = useQuery({
    queryKey: ["tripResources", agencyId, details.date, totals.totalKg],
    queryFn: () =>
      getTripResourceOptions({
        agencyId,
        deliveryDate: details.date,
        loadKg: totals.totalKg,
      }),
    enabled:
      !!agencyId &&
      !!details.date &&
      selected.length > 0 &&
      (step === "RESOURCES" || step === "ROUTE"),
  });

  const chosen: ChosenResources = {
    vehicle:
      resourceOptions?.vehicles.find(
        (o) => o.eligible && o.resource.vehicleId === state.vehicleId,
      )?.resource ?? null,
    driver:
      resourceOptions?.drivers.find(
        (o) => o.eligible && o.resource.driverId === state.driverId,
      )?.resource ?? null,
    agent:
      resourceOptions?.agents.find(
        (o) => o.eligible && o.resource.userId === state.agentId,
      )?.resource ?? null,
  };

  const orderedStops: AllocationDetail[] = state.stopOrder
    ? state.stopOrder.flatMap((id) =>
        selected.filter((d) => d.allocation.outletAllocationId === id),
      )
    : selected;

  const createTrip = useMutation({
    mutationFn: createDeliveryTrip,
    onSuccess: () => {
      for (const key of [
        "agencyDashboard",
        "agencyTrips",
        "outletAllocations",
        "agencyStock",
        "tripResources",
      ]) {
        queryClient.invalidateQueries({ queryKey: [key] });
      }
    },
  });

  const confirmPlan = () => {
    const { vehicle, driver, agent } = chosen;
    if (!vehicle || !driver || !agent || orderedStops.length === 0) return;

    createTrip.mutate(
      {
        agencyId,
        tripName: details.tripName.trim(),
        operationalArea: details.area.trim(),
        scheduledAt: `${details.date}T${details.time}:00`,
        vehicleId: vehicle.vehicleId,
        driverId: driver.driverId,
        agentId: agent.userId,
        outletAllocationIds: orderedStops.map(
          (s) => s.allocation.outletAllocationId,
        ),
      },
      {
        onSuccess: (trip) =>
          dispatch({
            type: "CONFIRMED",
            plan: { trip, stops: orderedStops, vehicle, driver, agent },
          }),
      },
    );
  };

  if (step === "CONFIRMED" && state.confirmed) {
    return (
      <TripConfirmed
        plan={state.confirmed}
        onMonitor={() => navigate("/agency/monitoring")}
        onBack={() => navigate("/agency/dashboard")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Create delivery trip
        </h1>
        <p className="mt-1 text-xs text-slate-600 md:text-sm">
          Set the delivery details, choose your resources, then review the
          route.
        </p>
      </div>

      <StepBar current={step} />

      {step === "DETAILS" && (
        <TripDetailsStep
          state={state}
          dispatch={dispatch}
          readyAllocations={readyAllocations}
          allocationsLoading={allocationsLoading}
          selected={selected}
          totalQty={totals.totalQty}
          totalKg={totals.totalKg}
          onCancel={() => navigate("/agency/dashboard")}
        />
      )}

      {step === "RESOURCES" && (
        <ResourceStep
          state={state}
          dispatch={dispatch}
          options={resourceOptions}
          optionsLoading={resourcesLoading}
          totals={totals}
          chosen={chosen}
        />
      )}

      {step === "ROUTE" && (
        <RouteReviewStep
          details={details}
          dispatch={dispatch}
          agency={agency}
          orderedStops={orderedStops}
          plannedIds={selected.map((d) => d.allocation.outletAllocationId)}
          chosen={chosen}
          onConfirm={confirmPlan}
          confirming={createTrip.isPending}
          error={createTrip.error?.message ?? null}
        />
      )}
    </div>
  );
}

export default CreateTrip;
