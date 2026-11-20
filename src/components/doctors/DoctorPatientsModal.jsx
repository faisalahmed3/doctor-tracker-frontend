
"use client";

import { useState } from "react";
import {
  X,
  Users,
  UserPlus,
  Trash2,
  CalendarDays,
  UserRound,
  Check,
  AlertCircle,
} from "lucide-react";

export default function DoctorPatientsModal({
  doctor,
  onClose,
  onAddPatient,
  onDeletePatient,
}) {
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleAddPatient = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const patient = {
      id: `PAT-${Date.now()}`,
      name: formData.get("name").trim(),
      age: Number(formData.get("age")),
      condition: formData.get("condition").trim(),
      registeredAt: new Date().toISOString().slice(0, 10),
    };

    onAddPatient(doctor.id, patient);

    form.reset();
    setShowForm(false);
  };

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="patients-modal-title"
        className="my-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
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
            className="btn btn-ghost btn-sm btn-square shrink-0"
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
              {doctor.patients.length}
            </p>
          </div>

        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">

          {/* Add Patient Button */}
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
              onClick={() => setShowForm(!showForm)}
              className="btn btn-sm shrink-0 rounded-lg border-0 bg-[#167d73] text-xs text-white hover:bg-[#12675f]"
            >
              <UserPlus size={15} />
              Add Patient
            </button>

          </div>

          {/* Add Patient Form */}
          {showForm && (
            <form
              onSubmit={handleAddPatient}
              className="mb-6 space-y-3 rounded-xl border border-[#d5ebe5] bg-[#f5fbf9] p-4"
            >

              <h4 className="text-sm font-bold text-[#102a43]">
                New Patient Information
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Patient Name
                  </label>

                  <input
                    name="name"
                    required
                    minLength={2}
                    placeholder="Enter patient name"
                    className="input input-bordered h-10 w-full rounded-lg border-slate-200 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Age
                  </label>

                  <input
                    name="age"
                    type="number"
                    min="0"
                    max="120"
                    required
                    placeholder="Enter age"
                    className="input input-bordered h-10 w-full rounded-lg border-slate-200 bg-white text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Patient Condition
                  </label>

                  <input
                    name="condition"
                    required
                    minLength={2}
                    placeholder="e.g. Hypertension"
                    className="input input-bordered h-10 w-full rounded-lg border-slate-200 bg-white text-sm"
                  />
                </div>

              </div>

              <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-sm rounded-lg border-slate-200 bg-white text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-sm rounded-lg border-0 bg-[#167d73] text-white hover:bg-[#12675f]"
                >
                  <UserPlus size={15} />
                  Save Patient
                </button>

              </div>

            </form>
          )}

          {/* Patient Records */}
          <div className="space-y-3">

            {doctor.patients.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">

                <Users size={28} className="mx-auto text-slate-300" />

                <p className="mt-3 text-sm font-semibold text-slate-600">
                  No patients assigned
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Add a patient to this doctor's list.
                </p>

              </div>
            ) : (
              doctor.patients.map((patient) => (
                <div
                  key={patient.id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <UserRound size={19} />
                      </div>

                      <div className="min-w-0">

                        <h4 className="text-sm font-bold text-[#102a43]">
                          {patient.name}
                        </h4>

                        <p className="mt-1 text-xs text-slate-400">
                          Patient ID: {patient.id}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">

                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                            Age: {patient.age}
                          </span>

                          <span className="rounded-md bg-[#e8f5f2] px-2 py-1 text-[10px] font-medium text-[#167d73]">
                            {patient.condition}
                          </span>

                        </div>

                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <CalendarDays size={12} />
                          Registered: {formatDate(patient.registeredAt)}
                        </div>

                      </div>
                    </div>

                    {confirmDeleteId === patient.id ? (
                      <div className="flex shrink-0 flex-col items-end gap-2">

                        <p className="text-[10px] text-red-600">
                          Remove patient?
                        </p>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              onDeletePatient(doctor.id, patient.id);
                              setConfirmDeleteId(null);
                            }}
                            className="btn btn-xs border-0 bg-red-600 text-white hover:bg-red-700"
                          >
                            <Check size={12} />
                            Yes
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="btn btn-xs border-slate-200 bg-white text-slate-600"
                          >
                            No
                          </button>
                        </div>

                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(patient.id)}
                        aria-label={`Remove ${patient.name}`}
                        className="btn btn-ghost btn-sm btn-square shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}

                  </div>
                </div>
              ))
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-5 py-4 sm:px-6">

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <AlertCircle size={14} />
            Patient records are demonstration data.
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm rounded-lg border-slate-200 bg-white px-5 text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}
