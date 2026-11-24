import {
  type Id,
  type Address,
  type ContactInfo,
  type AuditFields,
  type AccountStatus,
} from "./common";

export type AgencyAdminRole = "AGENCY_MANAGER";

export interface AgencyAdmin extends Address, ContactInfo, AuditFields {
  id: Id;
  agencyId: Id;
  fullName: string;
  status: AccountStatus;
  role: AgencyAdminRole;
  nic: string;
  lastLogAt: string;
}
