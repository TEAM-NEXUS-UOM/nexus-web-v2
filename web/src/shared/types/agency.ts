import {
  type Id,
  type AuditFields,
  type Address,
  type ContactInfo,
} from "./common";

export type ActiveStatus = "Active" | "Inactive";

export interface Agency extends ContactInfo, AuditFields {
  agencyId: Id;
  ManufactureId: Id;
  name: string;
  address: Address;
  latitude: number;
  longitude: number;
  auditFeilds: AuditFields;
  status: ActiveStatus;
}

export type CreateAgencyRequest = Omit<
  Agency,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateAegncyRequest = Partial<CreateAgencyRequest>;
