import { useState } from "react";
import { type Id } from "../../../../shared/types/common";
import { input, label, pill } from "./ui";

export interface ResourceRow {
  id: Id;
  title: string;
  meta: string;
  searchText: string;
  eligible: boolean;
  reason: string | null;
}

interface Props {
  rows: ResourceRow[];
  selectedId: Id | null;
  onSelect: (id: Id) => void;
  searchPlaceholder: string;
  forLabel: string;
  loading: boolean;
  emptyText: string;
}

function ResourceList({
  rows,
  selectedId,
  onSelect,
  searchPlaceholder,
  forLabel,
  loading,
  emptyText,
}: Props) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visible = query
    ? rows.filter((r) => r.searchText.toLowerCase().includes(query))
    : rows;

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        className={input}
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={label}>Available first</span>
        <span className="text-xs text-slate-500">{forLabel}</span>
      </div>

      {loading && <p className="text-xs text-slate-500">Checking availability…</p>}
      {!loading && visible.length === 0 && (
        <p className="rounded-lg bg-slate-100 p-4 text-xs text-slate-500">
          {rows.length === 0 ? emptyText : "No matches for this search."}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {visible.map((row) => {
          const selected = row.id === selectedId;
          return (
            <li
              key={row.id}
              className={`flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between ${
                selected
                  ? "border-primary bg-primary/5"
                  : row.eligible
                    ? "border-slate-200 bg-white"
                    : "border-slate-200 bg-slate-50 opacity-60"
              }`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {row.title}
                  </p>
                  {row.eligible ? (
                    <span className={`${pill} bg-green-100 text-green-800`}>
                      Available
                    </span>
                  ) : (
                    <span className={`${pill} bg-amber-100 text-amber-900`}>
                      {row.reason}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{row.meta}</p>
              </div>

              {row.eligible ? (
                <button
                  type="button"
                  onClick={() => onSelect(row.id)}
                  className={`cursor-pointer rounded-md px-5 py-1.5 text-sm font-medium sm:w-32 ${
                    selected
                      ? "bg-primary text-white"
                      : "border border-primary bg-white text-primary hover:bg-primary/5"
                  }`}
                >
                  {selected ? "Selected" : "Select"}
                </button>
              ) : (
                <span className="text-center text-xs text-slate-400 sm:w-32">
                  Cannot select
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ResourceList;
