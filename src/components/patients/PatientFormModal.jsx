
"use client";

import { useRef, useState } from "react";
import {
  X,
  UserPlus,
  Users,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

const inputClass =
  "input input-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#167d73] focus:bg-white focus:outline-none disabled:opacity-60";

const selectClass =
  "select select-bordered h-11 w-full rounded-xl border-slate-200 bg-slate-50 pl-10 text-sm text-slate-700 focus:border-[#167d73] focus:outline-none disabled:opacity-60";

const labelClass = "mb-1.5 block text-xs font-semibold text-slate-700";

const fieldClass = (base, hasError) =>
  `${base} ${hasError ? "border-red-300 bg-red-50" : ""}`;

const isActiveDoctor = (doctor) =>
  String(doctor?.status ?? "active").toLowerCase() !== "inactive";

function validatePatient(data, doctors, patient) {
  const errors = {};

  if (data.name.length < 2 || data.name.length > 80) {
    errors.name = "Patient name must be between 2 and 80 characters.";
  }

  if (
    !data.ageRaw ||
    !Number.isInteger(data.age) ||
    data.age < 0 ||
    data.age > 130
  ) {
    errors.age = "Enter a valid age between 0 and 130.";
  }

  if (data.condition.length < 2 || data.condition.length > 200) {
    errors.condition =
      "Condition must be between 2 and 200 characters.";
  }

  const selectedDoctor = doctors.find(
    (doctor) => String(doctor.id) === data.doctorId
  );

  if (!selectedDoctor) {
    errors.doctorId = "Please select a valid doctor.";
  } else {
    const isCurrentDoctor =
      patient &&
      String(patient.doctorId) === data.doctorId;

    if (!isActiveDoctor(selectedDoctor) && !isCurrentDoctor) {
      errors.doctorId =
        "Cannot assign patients to an inactive doctor.";
    }
  }

  return errors;
}

export default function PatientFormModal({
  patient = null,
  doctors = [],
  onClose,
  onSubmit,
  isSubmitting: externalSubmitting = false,
}) {
  const isEditing = Boolean(patient);

  const submittingRef = useRef(false);

  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const isBusy = localSubmitting || externalSubmitting;

  const isDoctorSelectable = (doctor) => {
    const isCurrentDoctor =
      isEditing &&
      String(doctor.id) === String(patient?.doctorId);

    return isActiveDoctor(doctor) || isCurrentDoctor;
  };

  const hasSelectableDoctors = doctors.some(isDoctorSelectable);

  const handleFieldChange = (event) => {
    const fieldName = event.target.name;

    if (fieldName) {
      setErrors((previous) => {
        if (!previous[fieldName]) return previous;

        const next = { ...previous };
        delete next[fieldName];

        return next;
      });
    }

    setSubmitError("");
  };

  const handleClose = () => {
    if (isBusy || submittingRef.current) return;

    onClose?.();
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (submittingRef.current || externalSubmitting) return;

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const ageRaw = String(formData.get("age") ?? "").trim();
    const age = Number(ageRaw);
    const condition = String(
      formData.get("condition") ?? ""
    ).trim();
    const doctorId = String(
      formData.get("doctorId") ?? ""
    ).trim();

    const values = { name, ageRaw, age, condition, doctorId };
    const validationErrors = validatePatient(
      values,
      doctors,
      patient
    );

    setErrors(validationErrors);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) return;

    submittingRef.current = true;
    setLocalSubmitting(true);

    try {
      const success = await onSubmit?.({
        name,
        age,
        condition,
        doctorId,
      });

      if (!success) return;
    } catch (error) {
      console.error("Patient submission error:", error);

      setSubmitError(
        error?.message || "Unable to save patient information."
      );
    } finally {
      submittingRef.current = false;
      setLocalSubmitting(false);
    }
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
        aria-labelledby="patient-modal-title"
        aria-busy={isBusy}
        className="my-auto flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f2] text-[#167d73]">
              {isEditing ? <Users size={22} /> : <UserPlus size={22} />}
            </div>

            <div className="min-w-0">
              <h2
                id="patient-modal-title"
                className="text-lg font-bold text-[#102a43]"
              >
                {isEditing ? "Edit Patient" : "Add New Patient"}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {isEditing
                  ? "Update patient details and doctor assignment."
                  : "Enter patient information and assign a doctor."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            aria-label="Close modal"
            className="btn btn-ghost btn-sm btn-square"
          >
            <X size={19} />
          </button>
        </div>

        <form
          key={patient?.id || "new-patient"}
          onSubmit={handleFormSubmit}
          onChange={handleFieldChange}
          noValidate
          className="min-h-0 space-y-4 overflow-y-auto p-5 sm:p-6"
        >
          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3"
            >
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <p className="text-xs text-red-700">{submitError}</p>
            </div>
          )}

          <div>
            <label htmlFor="patient-name" className={labelClass}>
              Patient Name
            </label>

            <input
              id="patient-name"
              name="name"
              type="text"
              defaultValue={patient?.name ?? ""}
              autoComplete="name"
              minLength={2}
              maxLength={80}
              required
              disabled={isBusy}
              placeholder="Enter patient name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? "patient-name-error" : undefined
              }
              className={fieldClass(inputClass, errors.name)}
            />

            {errors.name && (
              <p id="patient-name-error" className="mt-1 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="patient-age" className={labelClass}>
              Age
            </label>

            <input
              id="patient-age"
              name="age"
              type="number"
              defaultValue={patient?.age ?? ""}
              min="0"
              max="130"
              step="1"
              inputMode="numeric"
              required
              disabled={isBusy}
              placeholder="Enter patient age"
              aria-invalid={Boolean(errors.age)}
              aria-describedby={
                errors.age ? "patient-age-error" : undefined
              }
              className={fieldClass(inputClass, errors.age)}
            />

            {errors.age && (
              <p id="patient-age-error" className="mt-1 text-xs text-red-500">
                {errors.age}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="patient-condition" className={labelClass}>
              Medical Condition
            </label>

            <input
              id="patient-condition"
              name="condition"
              type="text"
              defaultValue={patient?.condition ?? ""}
              minLength={2}
              maxLength={200}
              required
              disabled={isBusy}
              placeholder="e.g. Hypertension"
              aria-invalid={Boolean(errors.condition)}
              aria-describedby={
                errors.condition
                  ? "patient-condition-error"
                  : undefined
              }
              className={fieldClass(inputClass, errors.condition)}
            />

            {errors.condition && (
              <p
                id="patient-condition-error"
                className="mt-1 text-xs text-red-500"
              >
                {errors.condition}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="patient-doctor" className={labelClass}>
              Assign Doctor
            </label>

            <div className="relative">
              <Stethoscope
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                id="patient-doctor"
                name="doctorId"
                defaultValue={patient?.doctorId ?? ""}
                required
                disabled={isBusy || !hasSelectableDoctors}
                aria-invalid={Boolean(errors.doctorId)}
                aria-describedby={
                  errors.doctorId ? "patient-doctor-error" : undefined
                }
                className={fieldClass(selectClass, errors.doctorId)}
              >
                <option value="">Select a doctor</option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={String(doctor.id)}
                    disabled={!isDoctorSelectable(doctor)}
                  >
                    {doctor.name} — {doctor.specialization || "General"}
                    {!isActiveDoctor(doctor) ? " (Inactive)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {errors.doctorId && (
              <p
                id="patient-doctor-error"
                className="mt-1 text-xs text-red-500"
              >
                {errors.doctorId}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs leading-5 text-slate-500">
                You can update patient information or transfer the
                patient to another active doctor.
              </p>
            </div>
          )}

          {!hasSelectableDoctors && (
            <p className="text-xs text-amber-600">
              No doctors are available for assignment.
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isBusy}
              className="btn h-11 min-h-11 rounded-xl border-slate-200 bg-white px-6 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isBusy || !hasSelectableDoctors}
              aria-busy={isBusy}
              className="btn h-11 min-h-11 rounded-xl border-0 bg-[#167d73] px-6 text-sm font-semibold text-white hover:bg-[#12675f] disabled:opacity-60"
            >
              {isBusy ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Saving...
                </>
              ) : (
                <>
                  {isEditing ? <Users size={17} /> : <UserPlus size={17} />}
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
