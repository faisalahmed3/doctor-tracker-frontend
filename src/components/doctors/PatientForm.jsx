
"use client";

import { UserPlus } from "lucide-react";

export default function PatientForm({
  onSubmit,
  onCancel,
  isSubmitting,
}) {
  const inputClass =
    "input input-bordered h-10 w-full rounded-lg border-slate-200 bg-white text-sm focus:border-[#167d73] focus:outline-none";

  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 space-y-3 rounded-xl border border-[#d5ebe5] bg-[#f5fbf9] p-4"
    >
      <h4 className="text-sm font-bold text-[#102a43]">
        New Patient Information
      </h4>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="patient-name"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Patient Name
          </label>

          <input
            id="patient-name"
            name="name"
            required
            minLength={2}
            placeholder="Enter patient name"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="patient-age"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Age
          </label>

          <input
            id="patient-age"
            name="age"
            type="number"
            min="0"
            max="120"
            step="1"
            required
            placeholder="Enter age"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="patient-condition"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Patient Condition
          </label>

          <input
            id="patient-condition"
            name="condition"
            required
            minLength={2}
            placeholder="e.g. Hypertension"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn btn-sm rounded-lg border-slate-200 bg-white text-slate-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-sm rounded-lg border-0 bg-[#167d73] text-white hover:bg-[#12675f] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Processing...
            </>
          ) : (
            <>
              <UserPlus size={15} />
              Save Patient
            </>
          )}
        </button>
      </div>
    </form>
  );
}
