import { type Id, type AuditFields } from "./common";

export type VehicleType = "LORRY" | "VAN" | "THREE_WHEELER" | "BIKE";


export type VehicleStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

export interface Vehicle extends AuditFields {
  vehicleId: Id;
  agencyId: Id;
  regNo: string;
  vehicleType: VehicleType;
  capacityKg: number;
  status: VehicleStatus;
}

export type CreateVehicleRequest = Omit<
  Vehicle,
  "vehicleId" | "agencyId" | keyof AuditFields
>;

export type UpdateVehicleRequest = Partial<CreateVehicleRequest>;
