import { type ManufacturerAdminRole } from "./manufacturerAdmin.types";
import { type Id } from "./common";
import type { AgencyAdminRole } from "./AgencyAdmin.types";

export type Role =
  | "SUPER_ADMIN"
  | ManufacturerAdminRole
  | AgencyAdminRole
  | "WAREHOUSE_MANAGER"
  | "WAREHOUSE_SUPERVISOR";

export interface AuthUser {
  userId: Id;
  fullName: string;
  email: string;
  role: Role;
  warehouseId: Id | null;
  agencyId: Id | null;
}
