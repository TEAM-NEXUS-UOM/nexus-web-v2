export type id = string;

export interface Address {
  number: number;
  city: string;
  district: string;
}
export interface AuditFields {
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfo {
  number: number;
  email: string | null;
}
