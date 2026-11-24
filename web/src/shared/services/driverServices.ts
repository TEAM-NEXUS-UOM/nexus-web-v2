import { type Driver } from "../types/driver";
import { mockDrivers } from "../mock/drivers";
import type { Id } from "../types/common";

export async function getDriverById(id: Id): Promise<Driver | undefined> {
  return mockDrivers.find((d) => d.driverId === id);
}

export async function getAllDrivers(): Promise<Driver[] | null> {
  return mockDrivers;
}

export async function getDriversByAgencyId(id: Id): Promise<Driver[] | null> {
  return mockDrivers.filter((d) => d.agencyId === id);
}
