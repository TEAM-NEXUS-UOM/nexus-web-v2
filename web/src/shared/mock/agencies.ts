import { type Agency } from "../types/agency";

export const mockAgencies: Agency[] = [
  {
    agencyId: "1",
    manufactureId: "1",
    name: "Lanka Distributors",
    latitude: 6.9271,
    longitude: 79.8612,
    status: "Active",

    phone: "0771234567",
    email: "info@lankadist.lk",

    line1: "45/3 Galle Road",
    city: "Colombo",
    district: "Colombo",

    createdAt: "2026-11-01T09:00:00",
    updatedAt: "2026-11-20T14:30:00",
  },

  {
    agencyId: "2",
    manufactureId: "2",
    name: "Kamal Distributors",
    latitude: 7.9271,
    longitude: 89.8612,
    status: "Active",

    phone: "0771234568",
    email: "info@kamaladist.lk",

    line1: "45/3 Temple Road",
    city: "Colombo",
    district: "Colombo",

    createdAt: "2026-10-01T09:00:00",
    updatedAt: "2026-12-20T14:30:00",
  },
];
