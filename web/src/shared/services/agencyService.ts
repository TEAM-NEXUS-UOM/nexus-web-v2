import { type Agency } from "../types/agency";
import { mockAgencies } from "../mock/agencies";
import { type Id } from "../types/common";

export async function getAgencies(): Promise<Agency[]> {
  return mockAgencies;
}

export async function getAgencyById(id: Id): Promise<Agency | undefined> {
  return mockAgencies.find((agency) => agency.agencyId === id);
}
