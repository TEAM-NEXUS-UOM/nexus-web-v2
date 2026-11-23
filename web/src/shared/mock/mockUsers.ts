import { type AuthUser } from "../types/auth.types";

export const mockUsers: AuthUser[] = [
  {
    userId: "u-super-001",
    fullName: "System Admin",
    email: "super@nexus.lk",
    role: "SUPER_ADMIN",
    agencyId: null,
    warehouseId: null,
  },
  {
    userId: "a1b2c3d4-e5f6-4789-8123-123456789011",
    fullName: "Kamal Perera",
    email: "kamal.perera@nexus.com",
    role: "MANUFACTURING_ADMIN",
    agencyId: null,
    warehouseId: null,
  },
  {
    userId: "u-whm-001",
    fullName: "Sunil Bandara",
    email: "sunil@centralwh.lk",
    role: "WAREHOUSE_MANAGER",
    agencyId: null,
    warehouseId: "1",
  },
  {
    userId: "u-whs-001",
    fullName: "Chamari Dias",
    email: "chamari@centralwh.lk",
    role: "WAREHOUSE_SUPERVISOR",
    agencyId: null,
    warehouseId: "1",
  },
  {
    userId: "u-agm-001",
    fullName: "Ruwan Jayasinghe",
    email: "manager@lankadist.lk",
    role: "AGENCY_MANAGER",
    agencyId: "1",
    warehouseId: null,
  },
  {
    userId: "u-agm-002",
    fullName: "Nadeesha Wijesinghe",
    email: "manager@kamaladist.lk",
    role: "AGENCY_MANAGER",
    agencyId: "2",
    warehouseId: null,
  },
];