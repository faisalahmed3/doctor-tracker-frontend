
"use client";

import { useState } from "react";
import { X, Users, UserPlus, Database } from "lucide-react";

import PatientForm from "./PatientForm";
import PatientCard from "./PatientCard";
import {
  confirmAction,
  showSuccess,
  showError,
  showWarning,
} from "@/lib/sweetAlert";

const getErrorMessage = (error, fallback) => {
  if (Array.isArray(error?.errors) && error.errors.length) {
    const messages = error.errors
      .map((item) => item?.message)
      .filter(Boolean);

    if (messages.length) return messages.join("\n");
  }

  return error?.message || fallback;
};

export default function DoctorPatientsModal({
  doctor,
  onClose,
  onAddPatient,
  onDeletePatient,
}) {
  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const patients = Array.isArray(doctor?.patients)
    ? doctor.patients
    : [];

  const isBusy = isAdding || deletingId !== null;

  const handleClose = () => {
    if (!isBusy) onClose?.();
  };

  const handleAddPatient = async (event) => {
    event.preventDefault();

    if (isBusy) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const ageValue = String(formData.get("age") ?? "").trim();
    const age = Number(ageValue);
    const condition = String(formData.get("condition") ?? "").trim();

    if (
      name.length < 2 ||
      name.length > 80 ||
      !ageValue ||
      !Number.isInteger(age) ||
      age < 0 ||
      age > 130 ||
      condition.length < 2 ||
      condition.length > 200
    ) {
      await showWarning(
        "Invalid Patient Information",
        "Please enter a valid patient name, age and condition."
      );
      return;
    }

    setIsAdding(true);

    try {
      const confirmation = await confirmAction({
        title: "Add New Patient?",
        text: `Are you sure you want to assign ${name} to ${doctor.name}?`,
        icon: "question",
        confirmText: "Yes, Add Patient",
        cancelText: "Review Details",
      });

      if (!confirmation?.isConfirmed) return;

      const savedPatient = await onAddPatient(doctor.id, {
        name,
        age,
        condition,
      });

      if (!savedPatient?.id) {
        throw new Error("The server did not return a valid patient record.");
      }

      form.reset();
      setShowForm(false);

      await showSuccess(
        "Patient Added Successfully!",
        `${savedPatient.name} has been assigned to ${doctor.name}.`
      );
    } catch (error) {
      console.error("Add patient failed:", error);

      await showError(
        "Unable to Add Patient",
        getErrorMessage(
          error,
          "Unable to save the patient. Please try again."
        )
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeletePatient = async (patient) => {
    if (isBusy || !patient?.id) return;

    setDeletingId(patient.id);

    try {
      const confirmation = await confirmAction({
        title: "Remove Patient?",
        text: `Are you sure you want to remove ${patient.name} from ${doctor.name}'s patient list?`,
        icon: "warning",
        confirmText: "Yes, Remove",
        cancelText: "Cancel",
        confirmColor: "#dc2626",
      });

      if (!confirmation?.isConfirmed) return;

      const result = await onDeletePatient(doctor.id, patient.id);

      if (!result) {
        throw new Error("The patient could not be removed from the database.");
      }

      await showSuccess(
        "Patient Removed Successfully!",
        `${patient.name} has been removed from ${doctor.name}'s patient list.`
      );
    } catch (error) {
      console.error("Delete patient failed:", error);

      await showError(
        "Unable to Remove Patient",
        getErrorMessage(
          error,
          "Unable to delete the patient. Please try again."
        )
      );
    } finally {
      setDeletingId(null);
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
        aria-labelledby="patients-modal-title"
        className="my-auto flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f2] text-[#167d73]">
              <Users size={22} />
            </div>

            <div className="min-w-0">
              <h2
                id="patients-modal-title"
                className="text-lg font-bold text-[#102a43]"
              >
                Doctor's Patients
              </h2>

              <p className="mt-1 truncate text-xs text-slate-400">
                {doctor.name} ·{" "}
                {doctor.specialization || "Specialization not specified"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            className="btn btn-ghost btn-sm btn-square shrink-0"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-3 border-b border-slate-100 bg-slate-50 p-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Doctor
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#102a43]">
              {doctor.name}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Total Patients
            </p>

            <p className="mt-1 text-sm font-bold text-[#167d73]">
              {patients.length}
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#102a43]">
                Patient List
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Patients assigned to this doctor.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm((visible) => !visible)}
              disabled={isBusy}
              className="btn btn-sm shrink-0 rounded-lg border-0 bg-[#167d73] text-xs text-white hover:bg-[#12675f] disabled:opacity-60"
            >
              <UserPlus size={15} />
              {showForm ? "Close Form" : "Add Patient"}
            </button>
          </div>

          {showForm && (
            <div className="mb-5">
              <PatientForm
                onSubmit={handleAddPatient}
                onCancel={() => setShowForm(false)}
                isSubmitting={isAdding}
              />
            </div>
          )}

          <div className="space-y-3">
            {patients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center">
                <Users size={28} className="mx-auto text-slate-300" />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No patients assigned
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add a patient to this doctor's list.
                </p>
              </div>
            ) : (
              patients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onDelete={handleDeletePatient}
                  isDeleting={deletingId === patient.id}
                  deleteDisabled={isBusy}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
            <Database size={15} className="shrink-0 text-[#167d73]" />
            <span>Patient records are stored in MongoDB.</span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            className="btn btn-sm rounded-lg border-slate-200 bg-white px-5 text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
