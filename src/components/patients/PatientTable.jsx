
"use client";

import {
  Users,
  UserRound,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function PatientTable({
  patients,
  onEdit,
  onDelete,
}) {
  if (patients.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <Users
          size={32}
          className="mx-auto text-slate-300"
        />

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
              <th className="py-4">Patient</th>
              <th>Age</th>
              <th>Medical Condition</th>
              <th>Assigned Doctor</th>
              <th>Registered</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-slate-100 transition hover:bg-slate-50/70"
              >
                {/* Patient */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f2] text-[#167d73]">
                      <UserRound size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#102a43]">
                        {patient.name}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {patient.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Age */}
                <td className="text-sm text-slate-600">
                  {patient.age}
                </td>

                {/* Condition */}
                <td>
                  <span className="inline-flex rounded-lg bg-[#e8f5f2] px-2.5 py-1.5 text-xs font-medium text-[#167d73]">
                    {patient.condition}
                  </span>
                </td>

                {/* Doctor */}
                <td>
                  <p className="text-sm font-medium text-slate-700">
                    {patient.doctorName || "N/A"}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    {patient.specialization || "N/A"}
                  </p>
                </td>

                {/* Registration */}
                <td>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={13} />
                    {formatDate(patient.registeredAt)}
                  </div>
                </td>

                {/* Actions */}
                <td>
                  <div className="flex justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(patient)}
                      aria-label={`Edit ${patient.name}`}
                      title="Edit patient"
                      className="btn btn-ghost btn-sm btn-square text-slate-400 hover:bg-[#e8f5f2] hover:text-[#167d73]"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(patient)}
                      aria-label={`Delete ${patient.name}`}
                      title="Delete patient"
                      className="btn btn-ghost btn-sm btn-square text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-[11px] text-slate-400">
          Patient information is currently stored as demonstration data.
        </p>
      </div>
    </div>
  );
}
