import {
  type Id,
  type AuditFields,
  type Address,
  type ContactInfo,
} from "./common";

export type ActiveStatus = "Active" | "Inactive";

export interface Agency extends ContactInfo, AuditFields ,Address {
  agencyId: Id;
  manufactureId: Id;
  name: string;
  latitude: number;
  longitude: number;
  status: ActiveStatus;
}

export type CreateAgencyRequest = Omit<
  Agency,
  "agencyId" | keyof AuditFields | "manufactureId" | "status"
>;

export type UpdateAgencyRequest = Partial<CreateAgencyRequest>;
