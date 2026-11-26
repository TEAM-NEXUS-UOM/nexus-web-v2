import { type Id } from "../../../../shared/types/common";
import { type Trip } from "../../../../shared/types/trip.types";
import { type AllocationDetail } from "../../../../shared/types/tripPlanning.types";
import { type Vehicle } from "../../../../shared/types/vehicle.types";
import { type Driver } from "../../../../shared/types/driver";
import { type Agent } from "../../../../shared/types/agent.types";

export type WizardStep = "DETAILS" | "RESOURCES" | "ROUTE" | "CONFIRMED";
export type ResourceTab = "VEHICLE" | "DRIVER" | "AGENT" | "REVIEW";

export interface TripDetails {
  tripName: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  area: string;
}

export interface LoadTotals {
  outletCount: number;
  totalQty: number;
  totalKg: number;
}

export interface ChosenResources {
  vehicle: Vehicle | null;
  driver: Driver | null;
  agent: Agent | null;
}

// Snapshot shown on the confirmation view (the source queries change after saving).
export interface ConfirmedPlan {
  trip: Trip;
  stops: AllocationDetail[];
  vehicle: Vehicle;
  driver: Driver;
  agent: Agent;
}

export interface TripCreateState {
  step: WizardStep;
  resourceTab: ResourceTab;
  details: TripDetails;
  allocationIds: Id[];
  vehicleId: Id | null;
  driverId: Id | null;
  agentId: Id | null;
  stopOrder: Id[] | null; // null = planned order
  confirmed: ConfirmedPlan | null;
}

export type TripCreateAction =
  | { type: "SET_DETAIL"; field: keyof TripDetails; value: string }
  | { type: "TOGGLE_ALLOCATION"; id: Id }
  | { type: "GO_TO_STEP"; step: WizardStep; tab?: ResourceTab }
  | { type: "SET_TAB"; tab: ResourceTab }
  | { type: "SELECT_VEHICLE"; id: Id }
  | { type: "SELECT_DRIVER"; id: Id }
  | { type: "SELECT_AGENT"; id: Id }
  | { type: "SET_STOP_ORDER"; order: Id[] }
  | { type: "CONFIRMED"; plan: ConfirmedPlan };

const clearResources = {
  vehicleId: null,
  driverId: null,
  agentId: null,
  resourceTab: "VEHICLE",
} as const;

export function createInitialState(
  allocationIds: Id[],
  date: string,
): TripCreateState {
  return {
    step: "DETAILS",
    resourceTab: "VEHICLE",
    details: { tripName: "", date, time: "", area: "" },
    allocationIds,
    vehicleId: null,
    driverId: null,
    agentId: null,
    stopOrder: null,
    confirmed: null,
  };
}

export function tripCreateReducer(
  state: TripCreateState,
  action: TripCreateAction,
): TripCreateState {
  switch (action.type) {
    case "SET_DETAIL": {
      const details = { ...state.details, [action.field]: action.value };
      // Eligibility depends on the date, so a new date clears chosen resources.
      return action.field === "date" && action.value !== state.details.date
        ? { ...state, details, ...clearResources }
        : { ...state, details };
    }
    case "TOGGLE_ALLOCATION": {
      const allocationIds = state.allocationIds.includes(action.id)
        ? state.allocationIds.filter((id) => id !== action.id)
        : [...state.allocationIds, action.id];
      // The load changes, so vehicle capacity must be checked again.
      return { ...state, allocationIds, stopOrder: null, ...clearResources };
    }
    case "GO_TO_STEP":
      return {
        ...state,
        step: action.step,
        resourceTab: action.tab ?? state.resourceTab,
      };
    case "SET_TAB":
      return { ...state, resourceTab: action.tab };
    case "SELECT_VEHICLE":
      return { ...state, vehicleId: action.id, resourceTab: "DRIVER" };
    case "SELECT_DRIVER":
      return { ...state, driverId: action.id, resourceTab: "AGENT" };
    case "SELECT_AGENT":
      return { ...state, agentId: action.id, resourceTab: "REVIEW" };
    case "SET_STOP_ORDER":
      return { ...state, stopOrder: action.order };
    case "CONFIRMED":
      return { ...state, step: "CONFIRMED", confirmed: action.plan };
  }
}
