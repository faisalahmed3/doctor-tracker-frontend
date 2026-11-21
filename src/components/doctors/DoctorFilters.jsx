
import { Search, Filter, RotateCcw, CalendarDays } from "lucide-react";

const inputClass =
  "input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#167d73] focus:bg-white focus:outline-none";

export default function DoctorFilters({
  searchTerm = "",
  specialization = "all",
  specializations = [],
  fromDate = "",
  toDate = "",
  resultCount = 0,
  hasActiveFilters = false,
  onSearchChange,
  onSpecializationChange,
  onFromDateChange,
  onToDateChange,
  onReset,
}) {
  return (
    <section className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={17} className="text-[#167d73]" />
        <h3 className="text-sm font-bold text-[#102a43]">
          Search & Filters
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label
            htmlFor="doctor-search"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Search Doctors
          </label>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="doctor-search"
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Name, email, hospital..."
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="doctor-specialization-filter"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Specialization
          </label>

          <select
            id="doctor-specialization-filter"
            value={specialization}
            onChange={(event) =>
              onSpecializationChange?.(event.target.value)
            }
            className="select select-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#167d73] focus:outline-none"
          >
            <option value="all">All Specializations</option>

            {specializations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="doctor-from-date"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Registered From
          </label>

          <div className="relative">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="doctor-from-date"
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(event) => onFromDateChange?.(event.target.value)}
              className={`${inputClass} pl-10 text-xs text-slate-600`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="doctor-to-date"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Registered To
          </label>

          <div className="relative">
            <CalendarDays
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="doctor-to-date"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(event) => onToDateChange?.(event.target.value)}
              className={`${inputClass} pl-10 text-xs text-slate-600`}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {resultCount}
          </span>{" "}
          matching doctors
        </p>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="btn btn-sm rounded-lg border-slate-200 bg-white text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <RotateCcw size={14} />
          Reset Filters
        </button>
      </div>
    </section>
  );
}
