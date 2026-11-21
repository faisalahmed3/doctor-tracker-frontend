
"use client";

import { UserPlus } from "lucide-react";

const inputClass =
  "input input-bordered h-10 w-full rounded-lg border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#167d73] focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-600";

export default function PatientForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isSubmitting) onSubmit?.(event);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-[#d5ebe5] bg-[#f5fbf9] p-4"
      aria-busy={isSubmitting}
    >
      <div>
        <h4 className="text-sm font-bold text-[#102a43]">
          New Patient Information
        </h4>

        <p className="mt-1 text-xs text-slate-500">
          Fill in the details to register a patient under this doctor.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="patient-name" className={labelClass}>
            Patient Name <span className="text-red-500">*</span>
          </label>

          <input
            id="patient-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            disabled={isSubmitting}
            placeholder="Enter patient name"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="patient-age" className={labelClass}>
            Age <span className="text-red-500">*</span>
          </label>

          <input
            id="patient-age"
            name="age"
            type="number"
            min="0"
            max="130"
            step="1"
            inputMode="numeric"
            required
            disabled={isSubmitting}
            placeholder="Enter age"
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="patient-condition" className={labelClass}>
            Patient Condition <span className="text-red-500">*</span>
          </label>

          <input
            id="patient-condition"
            name="condition"
            type="text"
            required
            minLength={2}
            maxLength={200}
            disabled={isSubmitting}
            placeholder="e.g. Hypertension"
            className={inputClass}
          />

          <p className="mt-1 text-[10px] text-slate-400">
            Enter the patient's primary medical condition.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse justify-end gap-2 border-t border-[#d5ebe5] pt-4 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="btn btn-sm rounded-lg border-slate-200 bg-white px-4 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="btn btn-sm rounded-lg border-0 bg-[#167d73] px-4 text-white hover:bg-[#12675f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-xs" />
              Saving Patient...
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
