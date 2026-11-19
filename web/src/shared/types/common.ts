export type Id = string;

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
  phone: number;
  email: string | null;
}
