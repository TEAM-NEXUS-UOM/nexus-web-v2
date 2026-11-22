export type Id = string;

export interface Address {
 
  line1:string
  city: string;
  district: string;
}

export interface AuditFields {
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  phone: string;
  email: string | null;
}
