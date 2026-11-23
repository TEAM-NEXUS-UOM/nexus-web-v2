export type ManufacturerAdminRole = 'MANUFACTURING_ADMIN';

export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';

export interface ManufacturerAdmin {
  userId: string;
  fullName: string;
  email: string;
  contactNumber: string | null;
  nic: string | null;
  role: ManufacturerAdminRole;
  accountStatus: AccountStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}
