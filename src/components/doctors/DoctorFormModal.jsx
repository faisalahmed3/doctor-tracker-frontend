
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Stethoscope, UserPlus } from "lucide-react";

const doctorSchema = z.object({
  name: z.string().trim().min(2, "Doctor name must be at least 2 characters."),
  specialization: z.string().trim().min(2, "Specialization is required."),
  hospital: z.string().trim().min(2, "Hospital name is required."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{7,20}$/, "Enter a valid phone number."),
  email: z.string().trim().email("Enter a valid email address."),
});

const inputClass =
  "input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 focus:border-[#167d73] focus:bg-white focus:outline-none";

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

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
        className="my-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
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
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 p-5 sm:p-6"
        >

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Doctor Name
            </label>

            <input
              {...register("name")}
              placeholder="e.g. Dr. Ahmed Rahman"
              className={inputClass}
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Specialization
            </label>

            <input
              {...register("specialization")}
              placeholder="e.g. Cardiology"
              className={inputClass}
            />

            {errors.specialization && (
              <p className="mt-1 text-xs text-red-500">
                {errors.specialization.message}
              </p>
            )}
          </div>

          {/* Hospital */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Hospital
            </label>

            <input
              {...register("hospital")}
              placeholder="Enter hospital name"
              className={inputClass}
            />

            {errors.hospital && (
              <p className="mt-1 text-xs text-red-500">
                {errors.hospital.message}
              </p>
            )}
          </div>

          {/* Phone and Email */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </label>

              <input
                {...register("phone")}
                type="tel"
                placeholder="+880 1XXX-XXXXXX"
                className={inputClass}
              />

              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                {...register("email")}
                type="email"
                placeholder="doctor@example.com"
                className={inputClass}
              />

              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="btn h-11 min-h-11 rounded-xl border-slate-200 bg-white px-6 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn h-11 min-h-11 rounded-xl border-0 bg-[#167d73] px-6 text-sm font-semibold text-white hover:bg-[#12675f]"
            >
              <UserPlus size={17} />
              Add Doctor
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
