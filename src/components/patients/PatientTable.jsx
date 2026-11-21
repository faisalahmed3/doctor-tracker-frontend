
"use client";

import {
  Users,
  UserRound,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "N/A";

  const raw = String(value);
  const datePart = raw.match(/^\d{4}-\d{2}-\d{2}/);

  const date = datePart
    ? new Date(`${datePart[0]}T00:00:00Z`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export default function PatientTable({
  patients = [],
  onEdit,
  onDelete,
  isBusy = false,
  deletingPatientId = null,
}) {
  const handleEdit = (patient) => {
    if (!isBusy) onEdit?.(patient);
  };

  const handleDelete = (patient) => {
    if (!isBusy && typeof onDelete === "function") {
      onDelete(patient);
    }
  };

  if (patients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-16 text-center">
        <Users size={32} className="mx-auto text-slate-300" />

        <h3 className="mt-4 text-sm font-bold text-[#102a43]">
          No Patients Found
        </h3>

        <p className="mt-2 text-xs text-slate-400">
          No patient records match your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="table min-w-[850px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th scope="col" className="py-4">
                Patient
              </th>
              <th scope="col">Age</th>
              <th scope="col">Medical Condition</th>
              <th scope="col">Assigned Doctor</th>
              <th scope="col">Registered</th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => {
              const patientName = patient.name || "Unnamed Patient";
              const patientId = patient.id || "N/A";

              const isDeleting =
                String(deletingPatientId) === String(patient.id);

              return (
                <tr
                  key={patient.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/70"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f2] text-[#167d73]">
                        <UserRound size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="max-w-[210px] break-words text-sm font-semibold text-[#102a43]">
                          {patientName}
                        </p>

                        <p
                          className="mt-1 max-w-[220px] break-all text-[11px] text-slate-400"
                          title={patientId}
                        >
                          {patientId}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="text-sm text-slate-600">
                    {patient.age ?? "N/A"}
                  </td>

                  <td>
                    <span className="inline-flex max-w-[220px] break-words rounded-lg bg-[#e8f5f2] px-2.5 py-1.5 text-xs font-medium text-[#167d73]">
                      {patient.condition || "Not specified"}
                    </span>
                  </td>

                  <td>
                    <p className="max-w-[190px] break-words text-sm font-medium text-slate-700">
                      {patient.doctorName || "N/A"}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {patient.specialization || "N/A"}
                    </p>
                  </td>

                  <td>
                    <div className="flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-500">
                      <CalendarDays size={13} className="shrink-0" />
                      {formatDate(patient.registeredAt)}
                    </div>
                  </td>

                  <td>
                    <div className="flex justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(patient)}
                        disabled={isBusy}
                        aria-label={`Edit ${patientName}`}
                        title="Edit patient"
                        className="btn btn-ghost btn-sm btn-square text-slate-400 hover:bg-[#e8f5f2] hover:text-[#167d73] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(patient)}
                        disabled={isBusy}
                        aria-label={`Delete ${patientName}`}
                        aria-busy={isDeleting}
                        title={
                          isDeleting
                            ? "Deleting patient..."
                            : "Delete patient"
                        }
                        className="btn btn-ghost btn-sm btn-square text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isDeleting ? (
                          <span className="loading loading-spinner loading-sm" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
