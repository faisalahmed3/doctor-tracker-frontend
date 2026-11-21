
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Stethoscope, UserPlus } from "lucide-react";

import FormField from "@/components/common/FormField";

const doctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Doctor name must be at least 2 characters.")
    .max(80, "Doctor name cannot exceed 80 characters."),

  specialization: z
    .string()
    .trim()
    .min(2, "Specialization is required.")
    .max(100, "Specialization cannot exceed 100 characters."),

  hospital: z
    .string()
    .trim()
    .min(2, "Hospital name is required.")
    .max(150, "Hospital name cannot exceed 150 characters."),

  phone: z.string().trim().refine((value) => {
    const digits = value.replace(/\D/g, "");

    return (
      /^\+?[\d\s()-]+$/.test(value) &&
      digits.length >= 7 &&
      digits.length <= 15
    );
  }, "Enter a valid phone number."),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(254, "Email address is too long.")
    .toLowerCase(),
});

const inputClass =
  "input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-[#167d73] focus:bg-white focus:outline-none";

const fields = [
  {
    name: "name",
    id: "doctor-name",
    label: "Doctor Name",
    placeholder: "e.g. Dr. Ahmed Rahman",
    type: "text",
    autoComplete: "name",
    maxLength: 80,
  },
  {
    name: "specialization",
    id: "doctor-specialization",
    label: "Specialization",
    placeholder: "e.g. Cardiology",
    type: "text",
    maxLength: 100,
  },
  {
    name: "hospital",
    id: "doctor-hospital",
    label: "Hospital",
    placeholder: "Enter hospital name",
    type: "text",
    autoComplete: "organization",
    maxLength: 150,
  },
  {
    name: "phone",
    id: "doctor-phone",
    label: "Phone Number",
    placeholder: "+880 1XXX-XXXXXX",
    type: "tel",
    autoComplete: "tel",
  },
  {
    name: "email",
    id: "doctor-email",
    label: "Email Address",
    placeholder: "doctor@example.com",
    type: "email",
    autoComplete: "email",
    maxLength: 254,
  },
];

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

  const handleClose = () => {
    if (!isSubmitting) onClose?.();
  };

  const renderField = (field) => {
    const error = errors[field.name];

    return (
      <FormField
        key={field.name}
        id={field.id}
        label={field.label}
        error={error?.message}
      >
        <input
          id={field.id}
          {...register(field.name)}
          type={field.type}
          placeholder={field.placeholder}
          autoComplete={field.autoComplete}
          maxLength={field.maxLength}
          disabled={isSubmitting}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${field.id}-error` : undefined}
          className={`${inputClass} ${
            error ? "border-red-300 bg-red-50" : ""
          }`}
        />
      </FormField>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
        className="my-auto flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5 sm:p-6">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4 overflow-y-auto p-5 sm:p-6"
        >
          {fields.slice(0, 3).map(renderField)}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.slice(3).map(renderField)}
          </div>

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
