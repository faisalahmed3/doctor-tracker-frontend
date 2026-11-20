
import {
  UserRound,
  Trash2,
  CalendarDays,
} from "lucide-react";

export default function PatientCard({
  patient,
  onDelete,
  isDeleting,
  deleteDisabled,
}) {
  const registeredDate = patient.registeredAt
    ? new Date(`${patient.registeredAt}T00:00:00`).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : "—";

  return (
    <div className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300">
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

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                Age: {patient.age}
              </span>

              <span className="rounded-md bg-[#e8f5f2] px-2 py-1 text-[10px] font-medium text-[#167d73]">
                {patient.condition}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
              <CalendarDays size={12} />
              Registered: {registeredDate}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(patient)}
          disabled={deleteDisabled}
          aria-label={`Remove ${patient.name}`}
          title="Remove Patient"
          className="btn btn-ghost btn-sm btn-square shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
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
