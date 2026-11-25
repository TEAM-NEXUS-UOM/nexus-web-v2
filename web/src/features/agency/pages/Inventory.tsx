import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/components/auth";
import { getAgencyStockSummary } from "../../../shared/services/agencyStockService";
import { getReadyAllocationDetails } from "../../../shared/services/outletAllocationService";
import { type Product } from "../../../shared/types/product.types";
import { formatQty, formatUnits, plural } from "../utils/format";

const card = "rounded-lg border border-slate-200 bg-white p-5";
const th =
  "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500";
const td = "px-3 py-3 text-sm text-slate-800";

function Inventory() {
  const { user } = useAuth();
  const agencyId = user?.agencyId ?? "";
  const navigate = useNavigate();

  const { data: stock = [], isLoading: stockLoading } = useQuery({
    queryKey: ["agencyStock", agencyId],
    queryFn: () => getAgencyStockSummary(agencyId),
    enabled: !!agencyId,
  });

  const { data: ready = [], isLoading: readyLoading } = useQuery({
    queryKey: ["outletAllocations", agencyId, "ready"],
    queryFn: () => getReadyAllocationDetails(agencyId),
    enabled: !!agencyId,
  });

  // One column per product that appears in the draft.
  const draftProducts: Product[] = [];
  ready
    .flatMap((d) => d.lines)
    .forEach(({ product }) => {
      if (!draftProducts.some((p) => p.productId === product.productId)) {
        draftProducts.push(product);
      }
    });

  const draftQty = ready.reduce((sum, d) => sum + d.totalQty, 0);
  const draftName = [...new Set(ready.map((d) => d.outlet.city))].join(" + ");
  const draftIds = ready.map((d) => d.allocation.outletAllocationId).join(",");

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Inventory & allocation
        </h1>
        <p className="mt-1 text-xs text-slate-600 md:text-sm">
          Allocate received stock to retail outlets before creating a delivery
          trip.
        </p>
      </div>

      <p className="rounded-lg border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-green-700">
        Dispatch accepted. The stock below is previously received and
        available for allocation.
      </p>

      <section className={card}>
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          Available stock
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem]">
            <thead className="border-b border-slate-200">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>On hand</th>
                <th className={th}>Allocated</th>
                <th className={th}>Available</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockLoading && (
                <tr>
                  <td className={td} colSpan={4}>
                    Loading stock…
                  </td>
                </tr>
              )}
              {!stockLoading && stock.length === 0 && (
                <tr>
                  <td className={`${td} text-slate-500`} colSpan={4}>
                    No stock received yet.
                  </td>
                </tr>
              )}
              {stock.map((row) => {
                const unit = row.product.unitOfMeasure;
                return (
                  <tr key={row.product.productId}>
                    <td className={`${td} font-semibold text-slate-900`}>
                      {row.product.productName}
                    </td>
                    <td className={td}>{formatQty(row.onHandQty, unit)}</td>
                    <td className={td}>{formatQty(row.allocatedQty, unit)}</td>
                    <td
                      className={`${td} font-semibold ${row.availableQty < 0 ? "text-red-600" : "text-primary"}`}
                    >
                      {formatQty(row.availableQty, unit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className={card}>
        {readyLoading ? (
          <p className="text-xs text-slate-500">Loading allocations…</p>
        ) : ready.length === 0 ? (
          <>
            <h2 className="text-lg font-bold text-slate-900">
              Allocation draft
            </h2>
            <p className="mt-2 text-xs text-slate-500">
              No allocations are ready for a trip right now.
            </p>
          </>
        ) : (
          <>
            <h2 className="mb-3 text-lg font-bold text-slate-900">
              Allocation draft • {draftName}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem]">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className={th}>Retail outlet</th>
                    {draftProducts.map((p) => (
                      <th key={p.productId} className={th}>
                        {p.productName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ready.map((d) => (
                    <tr key={d.allocation.outletAllocationId}>
                      <td className={td}>
                        <span className="font-semibold text-slate-900">
                          {d.outlet.name}
                        </span>{" "}
                        <span className="text-slate-500">• {d.outlet.city}</span>
                      </td>
                      {draftProducts.map((p) => {
                        const line = d.lines.find(
                          (l) => l.product.productId === p.productId,
                        );
                        return (
                          <td key={p.productId} className={td}>
                            {line ? formatQty(line.quantity, p.unitOfMeasure) : "–"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">{formatUnits(draftQty)}</span>{" "}
                allocated • {plural(ready.length, "outlet")}
              </p>
              <button
                type="button"
                className="w-full cursor-pointer rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 sm:w-auto"
                onClick={() =>
                  navigate(`/agency/trips/new?allocations=${draftIds}`)
                }
              >
                Create trip with allocation
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Inventory;
