
"use client";

import { UserRound, Trash2, CalendarDays } from "lucide-react";

const formatRegisteredDate = (value) => {
  if (!value) return "—";

  const raw = String(value);
  const datePart = raw.match(/^\d{4}-\d{2}-\d{2}/);

  const date = datePart
    ? new Date(`${datePart[0]}T00:00:00Z`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export default function PatientCard({
  patient,
  onDelete,
  isDeleting = false,
  deleteDisabled = false,
}) {
  if (!patient) return null;

  const patientName = patient.name || "Unnamed Patient";
  const patientId = patient.id || "—";

  const registeredDate = formatRegisteredDate(
    patient.registeredAt ?? patient.createdAt
  );

  const isDisabled = deleteDisabled || isDeleting;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-colors duration-200 hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <UserRound size={19} />
          </div>

          <div className="min-w-0">
            <h4 className="break-words text-sm font-bold text-[#102a43]">
              {patientName}
            </h4>

            <p className="mt-1 break-all text-[11px] text-slate-400">
              <span className="font-medium">Patient ID:</span> {patientId}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                Age: {patient.age ?? "—"}
              </span>

              <span className="max-w-full break-words rounded-md bg-[#e8f5f2] px-2 py-1 text-[10px] font-medium text-[#167d73]">
                {patient.condition || "Not specified"}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
              <CalendarDays size={12} className="shrink-0" />
              <span>Registered: {registeredDate}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete?.(patient)}
          disabled={isDisabled}
          aria-label={`Remove ${patientName}`}
          aria-busy={isDeleting}
          title={isDeleting ? "Removing patient..." : "Remove Patient"}
          className="btn btn-ghost btn-sm btn-square shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isDeleting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <Trash2 size={17} />
          )}
        </button>
      </div>
    </div>
  );
}
