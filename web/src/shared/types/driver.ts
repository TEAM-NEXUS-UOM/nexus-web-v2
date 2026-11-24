import {
  type Id,
  type Address,
  type AuditFields,
  type ContactInfo,
} from "./common";

export type Availability = "OFF_DUTY" | "AVAILABLE";

export interface Driver extends AuditFields, ContactInfo , Address{

  driverId:Id;
  agencyId:Id;
  nic: string;
  fullName: string;
  licenseNo: string;
  licenseExpiresAt:string;
  availability: Availability;
}
