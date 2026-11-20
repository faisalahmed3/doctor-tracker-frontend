
import {
  Users,
  Stethoscope,
  Activity,
} from "lucide-react";

const stats = [
  {
    key: "totalPatients",
    label: "Total Patients",
    icon: Users,
    style: "bg-blue-50 text-blue-600",
  },
  {
    key: "assignedDoctors",
    label: "Doctors with Patients",
    icon: Stethoscope,
    style: "bg-teal-50 text-[#167d73]",
  },
  {
    key: "totalConditions",
    label: "Medical Conditions",
    icon: Activity,
    style: "bg-violet-50 text-violet-600",
  },
];

export default function PatientStats({
  totalPatients,
  assignedDoctors,
  totalConditions,
}) {
  const values = {
    totalPatients,
    assignedDoctors,
    totalConditions,
  };

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.key}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.style}`}
            >
              <Icon size={22} />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                {stat.label}
              </p>

              <p className="mt-1 text-2xl font-bold text-[#102a43]">
                {values[stat.key]}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
