
"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, UserPlus, Users, Stethoscope } from "lucide-react";

import FormField from "@/components/common/FormField";

// Validation
const patientSchema = z.object({
  name: z.string().trim().min(2, "Patient name must be at least 2 characters."),

  age: z
    .string()
    .trim()
    .regex(/^(0|[1-9]\d{0,2})$/, "Enter a valid age.")
    .transform(Number)
    .refine((value) => value <= 120, "Age cannot exceed 120."),

  condition: z.string().trim().min(2, "Patient condition is required."),

  doctorId: z.string().min(1, "Please assign a doctor."),
});

const inputClass =
  "input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-[#167d73] focus:bg-white focus:outline-none";

export default function PatientFormModal({
  patient = null,
  doctors = [],
  onClose,
  onSubmit,
}) {
  const isEditing = Boolean(patient);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: patient?.name || "",
      age: patient?.age != null ? String(patient.age) : "",
      condition: patient?.condition || "",
      doctorId: patient?.doctorId || "",
    },
  });

  // Reset values when switching between patients
  useEffect(() => {
    reset({
      name: patient?.name || "",
      age: patient?.age != null ? String(patient.age) : "",
      condition: patient?.condition || "",
      doctorId: patient?.doctorId || "",
    });
  }, [patient, reset]);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-modal-title"
        className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f5f2] text-[#167d73]">
              {isEditing ? <Users size={22} /> : <UserPlus size={22} />}
            </div>

            <div>
              <h2
                id="patient-modal-title"
                className="text-lg font-bold text-[#102a43]"
              >
                {isEditing ? "Edit Patient" : "Add New Patient"}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {isEditing
                  ? "Update patient information and doctor assignment."
                  : "Enter patient information and assign a doctor."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="space-y-4 p-5 sm:p-6"
        >
          {/* Patient Name */}
          <FormField
            id="patient-name"
            label="Patient Name"
            error={errors.name?.message}
          >
            <input
              id="patient-name"
              {...register("name")}
              placeholder="Enter patient name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className={inputClass}
            />
          </FormField>

          {/* Age */}
          <FormField
            id="patient-age"
            label="Age"
            error={errors.age?.message}
          >
            <input
              id="patient-age"
              {...register("age")}
              type="number"
              min="0"
              max="120"
              placeholder="Enter patient age"
              aria-invalid={!!errors.age}
              className={inputClass}
            />
          </FormField>

          {/* Condition */}
          <FormField
            id="patient-condition"
            label="Medical Condition"
            error={errors.condition?.message}
          >
            <input
              id="patient-condition"
              {...register("condition")}
              placeholder="e.g. Hypertension"
              aria-invalid={!!errors.condition}
              className={inputClass}
            />
          </FormField>

          {/* Doctor Assignment */}
          <FormField
            id="patient-doctor"
            label="Assign Doctor"
            error={errors.doctorId?.message}
          >
            <div className="relative">
              <Stethoscope
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                id="patient-doctor"
                {...register("doctorId")}
                aria-invalid={!!errors.doctorId}
                className="select select-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm text-slate-700 focus:border-[#167d73] focus:outline-none"
              >
                <option value="">Select a doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} — {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          </FormField>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="btn h-11 min-h-11 rounded-xl border-slate-200 bg-white px-6 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || doctors.length === 0}
              className="btn h-11 min-h-11 rounded-xl border-0 bg-[#167d73] px-6 text-sm font-semibold text-white hover:bg-[#12675f] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus size={17} />
                  {isEditing ? "Save Changes" : "Add Patient"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
