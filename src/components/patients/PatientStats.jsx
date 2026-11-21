
import { Users, Stethoscope, Activity } from "lucide-react";

export default function PatientStats({
  totalPatients = 0,
  assignedDoctors = 0,
  totalConditions = 0,
}) {
  const stats = [
    {
      label: "Total Patients",
      value: totalPatients,
      icon: Users,
      style: "bg-blue-50 text-blue-600",
    },
    {
      label: "Doctors with Patients",
      value: assignedDoctors,
      icon: Stethoscope,
      style: "bg-teal-50 text-[#167d73]",
    },
    {
      label: "Medical Conditions",
      value: totalConditions,
      icon: Activity,
      style: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, style }) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style}`}
          >
            <Icon size={22} />
          </div>

          <div>
            <p className="text-xs text-slate-400">{label}</p>

            <p className="mt-1 text-2xl font-bold text-[#102a43]">
              {value}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
