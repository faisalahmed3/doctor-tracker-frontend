
"use client";

import { useState } from "react";
import {
  X,
  Users,
  UserPlus,
  AlertCircle,
} from "lucide-react";

import PatientForm from "./PatientForm";
import PatientCard from "./PatientCard";

import {
  confirmAction,
  showSuccess,
  showError,
  showWarning,
} from "@/lib/sweetAlert";

export default function DoctorPatientsModal({
  doctor,
  onClose,
  onAddPatient,
  onDeletePatient,
}) {
  const [showForm, setShowForm] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const patients = doctor.patients || [];

  // Add Patient
  const handleAddPatient = async (e) => {
    e.preventDefault();

    if (isAdding) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const ageValue = String(data.get("age") || "").trim();
    const age = Number(ageValue);
    const condition = String(data.get("condition") || "").trim();

    if (
      name.length < 2 ||
      !ageValue ||
      !Number.isInteger(age) ||
      age < 0 ||
      age > 120 ||
      condition.length < 2
    ) {
      await showWarning(
        "Invalid Information",
        "Please enter a valid patient name, age and condition."
      );
      return;
    }

    setIsAdding(true);

    try {
      const result = await confirmAction({
        title: "Add New Patient?",
        text: `Assign ${name} to ${doctor.name}?`,
        icon: "question",
        confirmText: "Yes, Add Patient",
        cancelText: "Review Details",
      });

      if (!result.isConfirmed) return;

      const patient = {
        id: `PAT-${Date.now()}`,
        name,
        age,
        condition,
        registeredAt: new Date().toISOString().slice(0, 10),
      };

      await onAddPatient(doctor.id, patient);

      form.reset();
      setShowForm(false);

      await showSuccess(
        "Patient Added!",
        `${name} has been assigned to ${doctor.name}.`
      );
    } catch (error) {
      console.error("Add patient error:", error);

      await showError(
        "Unable to Add Patient",
        "Something went wrong. Please try again."
      );
    } finally {
      setIsAdding(false);
    }
  };

  // Delete Patient
  const handleDeletePatient = async (patient) => {
    if (deletingId !== null) return;

    try {
      const result = await confirmAction({
        title: "Remove Patient?",
        text: `Remove ${patient.name} from ${doctor.name}'s patient list?`,
        confirmText: "Yes, Remove",
        cancelText: "Cancel",
        confirmColor: "#dc2626",
      });

      if (!result.isConfirmed) return;

      setDeletingId(patient.id);

      await onDeletePatient(doctor.id, patient.id);

      await showSuccess(
        "Patient Removed!",
        `${patient.name} has been removed successfully.`
      );
    } catch (error) {
      console.error("Delete patient error:", error);

      await showError(
        "Unable to Remove Patient",
        "Something went wrong. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget &&
          !isAdding &&
          deletingId === null
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="patients-modal-title"
        className="my-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
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
                {doctor.name} · {doctor.specialization}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isAdding || deletingId !== null}
            className="btn btn-ghost btn-sm btn-square"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        {/* Summary */}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
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
              onClick={() => setShowForm((prev) => !prev)}
              disabled={isAdding || deletingId !== null}
              className="btn btn-sm shrink-0 rounded-lg border-0 bg-[#167d73] text-xs text-white hover:bg-[#12675f]"
            >
              <UserPlus size={15} />
              {showForm ? "Close Form" : "Add Patient"}
            </button>
          </div>

          {/* Patient Form */}
          {showForm && (
            <PatientForm
              onSubmit={handleAddPatient}
              onCancel={() => setShowForm(false)}
              isSubmitting={isAdding}
            />
          )}

          {/* Patient List */}
          <div className="space-y-3">
            {patients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
                <Users
                  size={28}
                  className="mx-auto text-slate-300"
                />

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
                  deleteDisabled={deletingId !== null}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <AlertCircle size={14} />
            <span>Demonstration data</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isAdding || deletingId !== null}
            className="btn btn-sm rounded-lg border-slate-200 bg-white px-5 text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
