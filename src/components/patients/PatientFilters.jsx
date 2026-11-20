
"use client";

import {
  Search,
  Filter,
  RotateCcw,
  CalendarDays,
} from "lucide-react";

const inputClass =
  "input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#167d73] focus:bg-white focus:outline-none";

export default function PatientFilters({
  searchTerm,
  doctorFilter,
  conditionFilter,
  doctors,
  conditions,
  fromDate,
  toDate,
  resultCount,
  hasActiveFilters,
  onSearchChange,
  onDoctorChange,
  onConditionChange,
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Search */}
        <div>
          <label
            htmlFor="patient-search"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Search Patients
          </label>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="patient-search"
              type="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Name, patient ID, condition..."
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        {/* Doctor */}
        <div>
          <label
            htmlFor="patient-doctor-filter"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Assigned Doctor
          </label>

          <select
            id="patient-doctor-filter"
            value={doctorFilter}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="select select-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#167d73] focus:outline-none"
          >
            <option value="all">All Doctors</option>

            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label
            htmlFor="patient-condition-filter"
            className="mb-2 block text-xs font-semibold text-slate-600"
          >
            Medical Condition
          </label>

          <select
            id="patient-condition-filter"
            value={conditionFilter}
            onChange={(e) => onConditionChange(e.target.value)}
            className="select select-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm focus:border-[#167d73] focus:outline-none"
          >
            <option value="all">All Conditions</option>

            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* From Date */}
        <div>
          <label
            htmlFor="patient-from-date"
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
              id="patient-from-date"
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => onFromDateChange(e.target.value)}
              className={`${inputClass} pl-10 text-xs`}
            />
          </div>
        </div>

        {/* To Date */}
        <div>
          <label
            htmlFor="patient-to-date"
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
              id="patient-to-date"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => onToDateChange(e.target.value)}
              className={`${inputClass} pl-10 text-xs`}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {resultCount}
          </span>{" "}
          matching patients
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
