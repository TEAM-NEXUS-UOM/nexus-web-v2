import {
  type Id,
  type AuditFields,
  type ContactInfo,
  type Address,
  type AccountStatus
} from "./common";

export type ManufacturerAdminRole = "MANUFACTURING_ADMIN";



export interface ManufacturerAdmin extends AuditFields, ContactInfo , Address {
  userId: Id;
  fullName: string;
  nic: string | null;
  role: ManufacturerAdminRole;
  accountStatus: AccountStatus;
  lastLoginAt: string | null;
}
