import {
  type Id,
  type Address,
  type AuditFields,
  type ContactInfo,
} from "./common";
import { type ActiveStatus } from "./agency";

export type OutletType = "SUPERMARKET" | "GROCERY" | "PHARMACY" | "WHOLESALE";

export interface RetailOutlet extends Address, ContactInfo, AuditFields {
  outletId: Id;
  agencyId: Id;
  outletCode: string;
  name: string;
  outletType: OutletType;
  ownerName: string;
  latitude: number;
  longitude: number;
  status: ActiveStatus;
}

export type CreateRetailOutletRequest = Omit<
  RetailOutlet,
  "outletId" | "agencyId" | "status" | keyof AuditFields
>;

export type UpdateRetailOutletRequest = Partial<CreateRetailOutletRequest>;
