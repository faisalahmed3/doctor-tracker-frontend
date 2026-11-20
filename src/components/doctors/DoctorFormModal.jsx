
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Stethoscope, UserPlus } from "lucide-react";

import FormField from "@/components/common/FormField";

// Validation schema
const doctorSchema = z.object({
  name: z.string().trim().min(2, "Doctor name must be at least 2 characters."),

  specialization: z.string().trim().min(2, "Specialization is required."),

  hospital: z.string().trim().min(2, "Hospital name is required."),

  phone: z
    .string()
    .trim()
    .refine((value) => {
      const digits = value.replace(/\D/g, "");

      return (
        /^\+?[0-9\s()-]+$/.test(value) &&
        digits.length >= 7 &&
        digits.length <= 15
      );
    }, "Enter a valid phone number."),

  email: z.string().trim().email("Enter a valid email address."),
});

// Reusable input styling
const inputClass =
  "input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-[#167d73] focus:bg-white focus:outline-none";

// Input component styling based on validation
const getInputClass = (hasError) =>
  `${inputClass} ${hasError ? "border-red-300 bg-red-50" : ""}`;

export default function DoctorFormModal({ onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  // Submit form
  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  // Prevent closing while submitting
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
        aria-labelledby="doctor-modal-title"
        className="my-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f5f2] text-[#167d73]">
              <Stethoscope size={22} />
            </div>

            <div>
              <h2
                id="doctor-modal-title"
                className="text-lg font-bold text-[#102a43]"
              >
                Add New Doctor
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Enter the doctor's professional information.
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
          {/* Doctor Name */}
          <FormField
            id="doctor-name"
            label="Doctor Name"
            error={errors.name?.message}
          >
            <input
              id="doctor-name"
              {...register("name")}
              type="text"
              placeholder="e.g. Dr. Ahmed Rahman"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={
                errors.name ? "doctor-name-error" : undefined
              }
              className={getInputClass(!!errors.name)}
            />
          </FormField>

          {/* Specialization */}
          <FormField
            id="doctor-specialization"
            label="Specialization"
            error={errors.specialization?.message}
          >
            <input
              id="doctor-specialization"
              {...register("specialization")}
              type="text"
              placeholder="e.g. Cardiology"
              aria-invalid={!!errors.specialization}
              aria-describedby={
                errors.specialization
                  ? "doctor-specialization-error"
                  : undefined
              }
              className={getInputClass(!!errors.specialization)}
            />
          </FormField>

          {/* Hospital */}
          <FormField
            id="doctor-hospital"
            label="Hospital"
            error={errors.hospital?.message}
          >
            <input
              id="doctor-hospital"
              {...register("hospital")}
              type="text"
              placeholder="Enter hospital name"
              aria-invalid={!!errors.hospital}
              aria-describedby={
                errors.hospital ? "doctor-hospital-error" : undefined
              }
              className={getInputClass(!!errors.hospital)}
            />
          </FormField>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="doctor-phone"
              label="Phone Number"
              error={errors.phone?.message}
            >
              <input
                id="doctor-phone"
                {...register("phone")}
                type="tel"
                placeholder="+880 1XXX-XXXXXX"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                aria-describedby={
                  errors.phone ? "doctor-phone-error" : undefined
                }
                className={getInputClass(!!errors.phone)}
              />
            </FormField>

            <FormField
              id="doctor-email"
              label="Email Address"
              error={errors.email?.message}
            >
              <input
                id="doctor-email"
                {...register("email")}
                type="email"
                placeholder="doctor@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "doctor-email-error" : undefined
                }
                className={getInputClass(!!errors.email)}
              />
            </FormField>
          </div>

          {/* Actions */}
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
              disabled={isSubmitting}
              aria-busy={isSubmitting}
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
                  Add Doctor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
