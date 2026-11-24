import { type AccountStatus } from '../types/common.ts';
import { type ManufacturerAdmin } from '../types/manufacturerAdmin.types.ts';
import { mockManufacturerAdmins } from '../mock/manufacturerAdmins.ts';

export const getAllManufacturerAdmins = (): ManufacturerAdmin[] => {
  return mockManufacturerAdmins;
};

export const getManufacturerAdminById = (
  userId: string
): ManufacturerAdmin | undefined => {
  return mockManufacturerAdmins.find((admin) => admin.userId === userId);
};

export const getManufacturerAdminsByStatus = (
  status: AccountStatus
): ManufacturerAdmin[] => {
  return mockManufacturerAdmins.filter(
    (admin) => admin.accountStatus === status
  );
};
