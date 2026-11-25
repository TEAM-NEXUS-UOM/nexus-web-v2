import { type ProductUnitOfMeasure } from "../../../shared/types/product.types";
import { type VehicleType } from "../../../shared/types/vehicle.types";

const unitLabels: Record<ProductUnitOfMeasure, [string, string]> = {
  UNIT: ["unit", "units"],
  PACK: ["pack", "packs"],
  BOX: ["box", "boxes"],
  CASE: ["case", "cases"],
  KG: ["kg", "kg"],
  LITRE: ["litre", "litres"],
};

export const formatQty = (qty: number, unit: ProductUnitOfMeasure) =>
  `${qty.toLocaleString("en-US")} ${unitLabels[unit][qty === 1 ? 0 : 1]}`;

// Mixed products: count in generic units.
export const formatUnits = (qty: number) =>
  `${qty.toLocaleString("en-US")} unit${qty === 1 ? "" : "s"}`;

export const formatKg = (kg: number) =>
  (Math.round(kg * 10) / 10).toLocaleString("en-US");

export const plural = (n: number, word: string) =>
  `${n} ${word}${n === 1 ? "" : "s"}`;

export const pad2 = (n: number) => String(n).padStart(2, "0");

// "2026-11-26" → "26 Nov 2026"
export const formatDate = (date: string) =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "–";

// "14:30" (+ optional minutes) → "02:30 PM"
export const formatClock = (time: string, addMinutes = 0) => {
  if (!time) return "–";
  const d = new Date(`2000-01-01T${time}:00`);
  d.setMinutes(d.getMinutes() + addMinutes);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

// ISO / "yyyy-mm-ddTHH:mm:ss" → "26 Nov, 09:00"
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const todayLocal = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export const vehicleTypeLabel: Record<VehicleType, string> = {
  LORRY: "Lorry",
  VAN: "Van",
  THREE_WHEELER: "Three-wheeler",
  BIKE: "Bike",
};
