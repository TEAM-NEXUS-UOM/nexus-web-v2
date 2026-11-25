import { type Id } from "./common";
import { type Agent } from "./agent.types";
import { type Driver } from "./driver";
import { type OutletAllocation } from "./outletAllocation.types";
import { type Product } from "./product.types";
import { type RetailOutlet } from "./retailOutlet.types";
import { type Vehicle } from "./vehicle.types";
import { type Trip } from "./trip.types";

// One row of the "Delivery trips" list.
export interface TripListItem {
  trip: Trip;
  vehicle: Vehicle | null;
  driver: Driver | null;
  agent: Agent | null;
  outletCount: number;
  stopsTotal: number;
  stopsDelivered: number;
  stopsFailed: number;
}

// View models used while planning a delivery trip — computed, never stored.

export interface AllocationLine {
  product: Product;
  quantity: number;
}

export interface AllocationDetail {
  allocation: OutletAllocation;
  outlet: RetailOutlet;
  lines: AllocationLine[];
  totalQty: number;
  totalWeightKg: number;
}

export interface ResourceOption<T> {
  resource: T;
  eligible: boolean;
  reason: string | null;
}

export interface VehicleOption extends ResourceOption<Vehicle> {
  loadPercent: number;
}

export interface TripResourceOptions {
  vehicles: VehicleOption[];
  drivers: ResourceOption<Driver>[];
  agents: ResourceOption<Agent>[];
}

export interface TripResourceQuery {
  agencyId: Id;
  deliveryDate: string; // yyyy-mm-dd
  loadKg: number;
}

export interface CreateDeliveryTripInput {
  agencyId: Id;
  tripName: string;
  operationalArea: string;
  scheduledAt: string; // local "yyyy-mm-ddTHH:mm:00", same format as the mocks
  vehicleId: Id;
  driverId: Id;
  agentId: Id;
  outletAllocationIds: Id[]; // in stop order
}
